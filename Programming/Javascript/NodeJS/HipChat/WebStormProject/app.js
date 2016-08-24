var express = require('express');
var ac = require('atlassian-connect-express');
process.env.PWD = process.env.PWD || process.cwd(); // Fix expiry on Windows :(
// Static expiry middleware to help serve static resources efficiently
var expiry = require('static-expiry');
// We also need a few stock Node modules
var debug = require('debug')('HipConnectTester:application');
var http = require('http');
var path = require('path');
var os = require('os');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var errorhandler = require('errorhandler');

var routes = require('./routes');

// Anything in ./public is served up as static content
var staticDir = path.join(__dirname, 'public');

// Let's use Redis to store our data
ac.store.register('redis', require('atlassian-connect-express-redis'));

// Bootstrap Express
var app = express();
// Bootstrap the `atlassian-connect-express` library
var addon = ac(app);
// You can set this in `config.json`
var port = addon.config.port();

// Declares the environment to use in `config.json`
var devEnv = app.get('env') == 'development';

// Load the HipChat AC compat layer
var hipchat = require('atlassian-connect-express-hipchat')(addon, app);

// The following settings applies to all environments
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(devEnv ? 'dev' : 'default'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
// Enable the ACE global middleware (populates res.locals with add-on related stuff)
app.use(addon.middleware());
// Enable static resource fingerprinting for far future expires caching in production
app.use(expiry(app, {dir: staticDir, debug: devEnv}));
// Mount the static resource dirs
app.use(express.static(staticDir));
app.use(function(req, res, next) {
    res.locals.localBaseUrl = addon.config.localBaseUrl();
    next();
});
// Show nicer errors when in dev mode
if (devEnv) app.use(errorhandler());

// Wire up your routes using the express and `atlassian-connect-express` objects
routes(app, addon);

// Boot the damn thing
var server = http.createServer(app);

server.listen(port, function(){
    console.log('Add-on server running at '+ (addon.config.localBaseUrl()||('http://' + (os.hostname()) + ':' + port)));
    // Enables auto registration/de-registration of add-ons into a host in dev mode
    if (devEnv) addon.register();
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});

server.on('error', function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// import company certificates
/*var filepath = "hipchatcacert.pem";
var opts = require('https').globalAgent.options;
var root = filepath[0] === '/' ? '/' : '';
var filepaths = filepath.split(/\//g);
if (root) {
    filepaths.unshift(root);
}
opts.ca = opts.ca || [];
opts.ca.push(require('fs').readFileSync(require('path').join.apply(null, filepaths)));*/

