# Guelstie Universe Plugins

![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)

[![js-strict-standard-style](https://img.shields.io/badge/code%20style-strict%20standard-117D6B.svg)](https://github.com/denis-sokolov/strict-standard)

## Installation

To install this package...

1. Install [NodeJS](https://nodejs.org/en/)
2. Install [GIT](https://git-scm.com/)
3. Run terminal or command prompt.
4. Clone repo by running command `git clone https://github.com/Guelstie/Guelstie-Plugins.git`
5. Change directory to downloaded repo `cd Guelstie Plugins`
6. run command `npm install`

## How To Use

### Basic Usage

The `src` folder is where you will develop all plugins. 

The `dist` folder is where our final version or stable releases will be saved/built with gulp tasks and transpiled with babel.

The `game` folder is where a basic stripped down RPG Maker MV project is located. 

To start the development enviroment run `gulp serve` this will build the files and automatically save changes to the `game` folder 
as you make changes to a file. It will only copy the file you are changing.

To transpile a single .js file, change the file name in the gulpfile.js and use the command `gulp to-es6` this will transpile the file into 
the game projects js/plugins/ directory.

To Transpile a production ready or stable release of a plugin, go into the gulpfile.js and change the `production` variable to true and the filename
you wish to transpile. This will transpile the file into the `dist` folder.

### Push To Github project



## Credits


## License