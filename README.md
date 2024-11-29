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
shipthis/0.0.9 linux-x64 node-v20.17.0
$ shipthis --help [COMMAND]
USAGE
  $ shipthis COMMAND
...
```
<!-- usagestop -->

<!-- commands -->
# Command Topics

* [`shipthis apple`](./docs/apple.md) - Commands related to Apple Developer Portal
* [`shipthis apple apiKey`](docs/apple/apiKey.md) - Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account
* [`shipthis apple apiKey create`](docs/apple/apiKey/create.md) - Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account
* [`shipthis apple apiKey export`](docs/apple/apiKey/export.md) - Saves the current App Store Connect API Key to a ZIP file
* [`shipthis apple apiKey import`](docs/apple/apiKey/import.md) - Imports an App Store Connect API Key ZIP file into your ShipThis account
* [`shipthis apple apiKey status`](docs/apple/apiKey/status.md) - Displays the status of the App Store Connect API Keys in your Apple and ShipThis accounts. The API key is used to automatically publish your games to the App Store.
* [`shipthis apple certificate`](docs/apple/certificate.md) - Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account
* [`shipthis apple certificate create`](docs/apple/certificate/create.md) - Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account
* [`shipthis apple certificate export`](docs/apple/certificate/export.md) - Saves the current Apple Distribution Certificate to a ZIP file.
* [`shipthis apple certificate import`](docs/apple/certificate/import.md) - Imports an iOS Distribution Certificate to your ShipThis account
* [`shipthis apple certificate status`](docs/apple/certificate/status.md) - Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign all of your iOS apps.
* [`shipthis apple login`](docs/apple/login.md) - Authenticate with Apple - saves the session to the auth file
* [`shipthis apple status`](docs/apple/status.md) - Shows the status of the Apple authentication and integration
* [`shipthis dashboard`](docs/dashboard.md) - Opens the web-browser to your ShipThis dashboard
* [`shipthis game`](docs/game.md) - Commands related to Game Management
* [`shipthis game build`](docs/game/build.md) - Commands related to builds for a specific game
* [`shipthis game build download`](docs/game/build/download.md) - Downloads the given build artifact to the specified file
* [`shipthis game build list`](docs/game/build/list.md) - Lists the builds for successful jobs of a game.
* [`shipthis game create`](docs/game/create.md) - Create a new game
* [`shipthis game details`](docs/game/details.md) - Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.
* [`shipthis game export`](docs/game/export.md) - Downloads the shipthis.json file for a given game into the current directory.
* [`shipthis game ios`](docs/game/ios.md) - Commands related to the iOS platform for a specific game
* [`shipthis game ios app`](docs/game/ios/app.md) - Commands related to the App Store App for a specific game
* [`shipthis game ios profile`](docs/game/ios/profile.md) - Commands related to the App Store Provisioning Profiles for this Game
* [`shipthis game ios status`](docs/game/ios/status.md) - Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.
* [`shipthis game job`](docs/game/job.md) - Commands related to jobs for a specific game
* [`shipthis game job list`](docs/game/job/list.md) - Lists the jobs for a game. If --gameId is not provided it will look in the current directory.
* [`shipthis game job status`](docs/game/job/status.md) - Shows the real-time status of a job.
* [`shipthis game list`](docs/game/list.md) - Shows a list of all your games
* [`shipthis game ship`](docs/game/ship.md) - Builds the app (for all platforms with valid credentials) and ships it to the stores
* [`shipthis game status`](docs/game/status.md) - Shows the Game status. If --gameId is not provided it will look in the current directory.
* [`shipthis game wizard`](docs/game/wizard.md) - Runs all the steps for the specific platform
* [`shipthis help`](docs/help.md) - Display help for shipthis.
* [`shipthis login`](docs/login.md) - Authenticate - will create a new account if one does not exist.
* [`shipthis status`](docs/status.md) - Displays the current overall status.

<!-- commandsstop -->
