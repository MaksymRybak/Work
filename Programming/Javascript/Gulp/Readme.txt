Gulp is a task manager for web projects (task manager)
Gulp to inject js and css. It can inject into HTML bower js and css automatically (using tool wiredep).
Auto restarting js application

JS Hint - code quality eforcement (detects potential errors, enforces coding convention)
example: https://github.com/jonathanfmills/CodingStandards/blob/master/.jshintrc
VS Code has jshint plugin.

JS CS - coding style (enforces style conventions)
example: https://github.com/jonathanfmills/CodingStandards/blob/master/.jscsrc
VS Code has jscs plugin

Gulp instructions:
Installed by npm - npm install gulp /g
To run a task - gulp style (style is the name of task)
To inject js into our HTML file we should create these comment lines:
 <!-- bower:js -->
 <!-- endbower -->
We can add overrides property to our bower.json file to override our dependecies bower props.


Wiredep:
installed by npm locally - npm install wiredep --save-dev
define gulp task which uses wiredep
wiredep will look for bower.json where it will search for dependencies
we have to pass to wiredep the directory where to get all dependencies

we can inject local dependencies using gult-inject, to install it use npm gulp-inject --save-dev

we can use gulp-nodemon to monitor our files and restart the server when something changes 
install it by typing npm install gulp-nodemon --save-dev
