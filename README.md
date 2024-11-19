shipthis
=================

# Introduction

Mobile Game Shipping Tool

[![Version](https://img.shields.io/npm/v/shipthis.svg)](https://npmjs.org/package/shipthis)
[![Downloads/week](https://img.shields.io/npm/dw/shipthis.svg)](https://npmjs.org/package/shipthis)


<!-- toc -->
* [Introduction](#introduction)
* [Usage](#usage)
* [Command Topics](#command-topics)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g shipthis
$ shipthis COMMAND
running command...
$ shipthis (--version)
shipthis/0.0.8 linux-x64 node-v20.17.0
$ shipthis --help [COMMAND]
USAGE
  $ shipthis COMMAND
...
```
<!-- usagestop -->

# Command Topics

* [`shipthis apple`](docs//apple.md) - Commands related to Apple Developer Portal
* [`shipthis apple apiKey`](docs//apple/apiKey.md) - Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account
* [`shipthis apple certificate`](docs//apple/certificate.md) - Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account
* [`shipthis apple login`](docs//apple/login.md) - Authenticate with Apple - saves the session to the auth file
* [`shipthis apple status`](docs//apple/status.md) - Shows the status of the Apple authentication and integration
* [`shipthis dashboard`](docs//dashboard.md) - Opens the web-browser to your ShipThis dashboard
* [`shipthis game`](docs//game.md) - Commands related to Game Management
* [`shipthis game build`](docs//game/build.md) - Commands related to builds for a specific game
* [`shipthis game create`](docs//game/create.md) - Create a new game
* [`shipthis game details`](docs//game/details.md) - Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.
* [`shipthis game export`](docs//game/export.md) - Downloads the shipthis.json file for a given game into the current directory.
* [`shipthis game ios`](docs//game/ios.md) - Commands related to the iOS platform for a specific game
* [`shipthis game job`](docs//game/job.md) - Commands related to jobs for a specific game
* [`shipthis game list`](docs//game/list.md) - Shows a list of all your games
* [`shipthis game ship`](docs//game/ship.md) - Builds the app (for all platforms with valid credentials) and ships it to the stores
* [`shipthis game status`](docs//game/status.md) - Shows the Game status. If --gameId is not provided it will look in the current directory.
* [`shipthis game wizard`](docs//game/wizard.md) - Runs all the steps for the specific platform
* [`shipthis help`](docs//help.md) - Display help for shipthis.
* [`shipthis login`](docs//login.md) - Authenticate - will create a new account if one does not exist.
* [`shipthis status`](docs//status.md) - Displays the current overall status.

<!-- commandsstop -->
