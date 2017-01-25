# Guelstie Universe Plugins
----------
![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)

[![js-strict-standard-style](https://img.shields.io/badge/code%20style-strict%20standard-117D6B.svg)](https://github.com/denis-sokolov/strict-standard)

# Installation
----------

1. Install [NodeJS](https://nodejs.org/en/)
2. Install [GIT](https://git-scm.com/)
3. Run terminal or command prompt.
4. Clone repo by running command `git clone https://github.com/Guelstie/Guelstie-Plugins.git`
5. Change directory to downloaded repo `cd Guelstie Plugins`
6. run command `npm install`

# How To Use
----------

The `src` folder is where you will develop all plugins. 

The `dist` folder is where our final version or stable releases will be saved/built with gulp tasks and transpiled with babel.

The `game` folder is where a basic stripped down RPG Maker MV project is located. 

To start the development enviroment run `gulp serve` this will build the files and automatically save changes to the `game` folder 
as you make changes to a file. It will only copy the file you are changing.

To transpile a single .js file, change the file name in the gulpfile.js and use the command `gulp to-es6` this will transpile the file into 
the game projects js/plugins/ directory.

To Transpile a production ready or stable release of a plugin, go into the gulpfile.js and change the `production` variable to true and the filename
you wish to transpile. This will transpile the file into the `dist` folder.

## Contributing To Guelsite Plugins
----------
### Using The Command Line

Be sure to clone this repo, or fork a new one to your own account and proceed to download, or clone the repo to your local PC.

Once you have a working directory pull the latest changed from the remote to ensure you are up to date.

`git pull origin dev` 
Grabs online updates from dev branch and merges them with your local work

If using a fork of this repo please check out this [Fork Syncing Guide](https://help.github.com/articles/syncing-a-fork/)

Once you have files that have been changed and you want to pull to your repo then stage changes and commit them

Stage all changes
`git add -A`

Comit all changes
`git commit -m "Commit Message`

or

With One Command
`git add -A && git commit -m "Your Message"`

Then starta new pull request with your changes.

Send Pull Requests to the dev branch. 

Ensure changes are eslint validated. Our ESLint configuration file is provided in the repository and you should check against it before submitting.

[Pull Request Docs](https://help.github.com/articles/about-pull-requests/)

### Using Brackets Code Editor
[Brakctes Git Guide](https://github.com/ltngames/Guelstie-Plugins/tree/dev/readme-assets/brackets-contributing.md)


## Coding style preferences are not contributions
----------
If your PR is doing little more than changing the source code into a format / coding style that you prefer then we will automatically close it. All PRs must adhere to the coding style already set-out across Guelstie plugins. Your personal preferences for how things should "look" or be structured do not apply here, sorry. PRs should fix bugs, fix documentation or add features. No changes for the sake of change.Coding style preferences are not contributions

# Code Style Guide
----------
We use [JS Standard Code Style](https://github.com/feross/standard) with a [Strict Standard Config](https://github.com/denis-sokolov/strict-standard-config).

## The Rules

- **2 spaces** – for indentation
- **Single quotes for strings** – except to avoid escaping
- **No unused variables** – this one catches *tons* of bugs!
- **No semicolons** – [It's][1] [fine.][2] [Really!][3]
- **Never start a line with `(`, `[`, or `` ` ``**
  - This is the **only** gotcha with omitting semicolons – *automatically checked for you!*
  - [More details][4]
- **Space after keywords** `if (condition) { ... }`
- **Space after function name** `function name (arg) { ... }`
- Always use `===` instead of `==` – but `obj == null` is allowed to check `null || undefined`.
- Always handle the node.js `err` function parameter
- Always prefix browser globals with `window` – except `document` and `navigator` are okay
  - Prevents accidental use of poorly-named browser globals like `open`, `length`,
    `event`, and `name`.

## Credits


## License