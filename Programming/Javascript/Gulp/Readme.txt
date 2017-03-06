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


Wiredep:
installed by npm locally - npm install wiredep --save-dev
define gulp task which uses wiredep
wiredep will look for bower.json where it will search for dependencies
we have to pass to wiredep the directory where to get all dependencies

