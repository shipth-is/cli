shipthis
=================

# Development Notes

To build and run locally:

```
npm run build
npm link
```

When you add or remove a command you will need to update the `"exports"` section in the `package.json` file using:

```
find src/commands/ -type f | sed "s/src\([^\.]*\)\..*$/dist\1.js/g"
```

# Zero to iOS shipping steps

```
shipthis login
shipthis game create
shipthis apple login
shipthis apple apiKey create
shipthis apple certificate create
shipthis game ios app create
shipthis game ios app sync
shipthis game ios profile create
shipthis game ship
```



# Introduction

Mobile Game Shipping Tool

[![Version](https://img.shields.io/npm/v/shipthis.svg)](https://npmjs.org/package/shipthis)
[![Downloads/week](https://img.shields.io/npm/dw/shipthis.svg)](https://npmjs.org/package/shipthis)


<!-- toc -->
* [Development Notes](#development-notes)
* [Zero to iOS shipping steps](#zero-to-ios-shipping-steps)
* [Introduction](#introduction)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shipthis
$ shipthis COMMAND
running command...
$ shipthis (--version)
shipthis/0.0.0 linux-x64 node-v20.17.0
$ shipthis --help [COMMAND]
USAGE
  $ shipthis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shipthis apple apiKey create`](#shipthis-apple-apikey-create)
* [`shipthis apple apiKey export FILE`](#shipthis-apple-apikey-export-file)
* [`shipthis apple apiKey import FILE`](#shipthis-apple-apikey-import-file)
* [`shipthis apple apiKey status`](#shipthis-apple-apikey-status)
* [`shipthis apple certificate create`](#shipthis-apple-certificate-create)
* [`shipthis apple certificate export FILE`](#shipthis-apple-certificate-export-file)
* [`shipthis apple certificate import FILE`](#shipthis-apple-certificate-import-file)
* [`shipthis apple certificate status`](#shipthis-apple-certificate-status)
* [`shipthis apple login`](#shipthis-apple-login)
* [`shipthis apple status`](#shipthis-apple-status)
* [`shipthis dashboard`](#shipthis-dashboard)
* [`shipthis game create`](#shipthis-game-create)
* [`shipthis game export GAME_ID`](#shipthis-game-export-game_id)
* [`shipthis game ios app create`](#shipthis-game-ios-app-create)
* [`shipthis game ios app status`](#shipthis-game-ios-app-status)
* [`shipthis game ios app sync`](#shipthis-game-ios-app-sync)
* [`shipthis game ios profile create`](#shipthis-game-ios-profile-create)
* [`shipthis game ios profile export FILE`](#shipthis-game-ios-profile-export-file)
* [`shipthis game ios profile import FILE`](#shipthis-game-ios-profile-import-file)
* [`shipthis game ios profile status`](#shipthis-game-ios-profile-status)
* [`shipthis game ios status`](#shipthis-game-ios-status)
* [`shipthis game job list`](#shipthis-game-job-list)
* [`shipthis game job status JOB_ID`](#shipthis-game-job-status-job_id)
* [`shipthis game list`](#shipthis-game-list)
* [`shipthis game ship`](#shipthis-game-ship)
* [`shipthis game status`](#shipthis-game-status)
* [`shipthis game version`](#shipthis-game-version)
* [`shipthis help [COMMAND]`](#shipthis-help-command)
* [`shipthis login`](#shipthis-login)
* [`shipthis status`](#shipthis-status)

## `shipthis apple apiKey create`

Creates an App Store Connect API in your Apple Developer account and saves the private key in your ShipThis account

```
USAGE
  $ shipthis apple apiKey create [-f]

FLAGS
  -f, --force

DESCRIPTION
  Creates an App Store Connect API in your Apple Developer account and saves the private key in your ShipThis account

EXAMPLES
  $ shipthis apple apiKey create

  $ shipthis apple apiKey create --force
```

_See code: [src/commands/apple/apiKey/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/apiKey/create.ts)_

## `shipthis apple apiKey export FILE`

Saves the current App Store Connect API Key to a ZIP file

```
USAGE
  $ shipthis apple apiKey export FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force  Overwrite the file if it already exists

DESCRIPTION
  Saves the current App Store Connect API Key to a ZIP file

EXAMPLES
  $ shipthis apple apiKey export userApiKey.zip
```

_See code: [src/commands/apple/apiKey/export.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/apiKey/export.ts)_

## `shipthis apple apiKey import FILE`

Imports an App Store Connect API Key to your ShipThis account

```
USAGE
  $ shipthis apple apiKey import FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force

DESCRIPTION
  Imports an App Store Connect API Key to your ShipThis account

EXAMPLES
  $ shipthis apple apiKey import userApiKey.zip
```

_See code: [src/commands/apple/apiKey/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/apiKey/import.ts)_

## `shipthis apple apiKey status`

Displays the status of the App Store Connect API Key in your Apple and ShipThis accounts. This key is used to automatically publish your games to the App Store.

```
USAGE
  $ shipthis apple apiKey status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of the App Store Connect API Key in your Apple and ShipThis accounts. This key is used to
  automatically publish your games to the App Store.

EXAMPLES
  $ shipthis apple apiKey status

  $ shipthis apple apiKey status --noAppleAuth
```

_See code: [src/commands/apple/apiKey/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/apiKey/status.ts)_

## `shipthis apple certificate create`

Creates an iOS Distribution Certificate in your Apple Developer account and saves the private key in your ShipThis account

```
USAGE
  $ shipthis apple certificate create [-f]

FLAGS
  -f, --force

DESCRIPTION
  Creates an iOS Distribution Certificate in your Apple Developer account and saves the private key in your ShipThis
  account

EXAMPLES
  $ shipthis apple certificate create

  $ shipthis apple certificate create --force
```

_See code: [src/commands/apple/certificate/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/create.ts)_

## `shipthis apple certificate export FILE`

Saves the current Apple Distribution Certificate to a ZIP file.

```
USAGE
  $ shipthis apple certificate export FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force  Overwrite the file if it already exists

DESCRIPTION
  Saves the current Apple Distribution Certificate to a ZIP file.

EXAMPLES
  $ shipthis apple certificate export userCert.zip
```

_See code: [src/commands/apple/certificate/export.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/export.ts)_

## `shipthis apple certificate import FILE`

Imports an iOS Distribution Certificate to your ShipThis account

```
USAGE
  $ shipthis apple certificate import FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force

DESCRIPTION
  Imports an iOS Distribution Certificate to your ShipThis account

EXAMPLES
  $ shipthis apple certificate import userCert.zip
```

_See code: [src/commands/apple/certificate/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/import.ts)_

## `shipthis apple certificate status`

Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign all of your iOS apps.

```
USAGE
  $ shipthis apple certificate status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign
  all of your iOS apps.

EXAMPLES
  $ shipthis apple certificate status

  $ shipthis apple certificate status --noAppleAuth
```

_See code: [src/commands/apple/certificate/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/status.ts)_

## `shipthis apple login`

Authenticate with Apple - saves the session to the auth file

```
USAGE
  $ shipthis apple login [-f] [-e <value>]

FLAGS
  -e, --appleEmail=<value>  Your Apple email address
  -f, --force

DESCRIPTION
  Authenticate with Apple - saves the session to the auth file

EXAMPLES
  $ shipthis apple login

  $ shipthis apple login --force --appleEmail me@email.nowhere
```

_See code: [src/commands/apple/login.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/login.ts)_

## `shipthis apple status`

Shows the status of the Apple authentication and integration

```
USAGE
  $ shipthis apple status

DESCRIPTION
  Shows the status of the Apple authentication and integration

EXAMPLES
  $ shipthis apple status
```

_See code: [src/commands/apple/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/status.ts)_

## `shipthis dashboard`

Opens the web-browser to your ShipThis dashboard

```
USAGE
  $ shipthis dashboard

DESCRIPTION
  Opens the web-browser to your ShipThis dashboard

EXAMPLES
  $ shipthis dashboard
```

_See code: [src/commands/dashboard.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/dashboard.ts)_

## `shipthis game create`

Create a new game

```
USAGE
  $ shipthis game create [-f] [-n <value>]

FLAGS
  -f, --force
  -n, --name=<value>  The name of the game

DESCRIPTION
  Create a new game

EXAMPLES
  $ shipthis game create
```

_See code: [src/commands/game/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/create.ts)_

## `shipthis game export GAME_ID`

Downloads the shipthis.json file for a given game into the current directory.

```
USAGE
  $ shipthis game export GAME_ID [-f]

ARGUMENTS
  GAME_ID  The ID of the game to export (use "list" to get the ID)

FLAGS
  -f, --force

DESCRIPTION
  Downloads the shipthis.json file for a given game into the current directory.

EXAMPLES
  $ shipthis game export abcd1234

  $ shipthis game export abcd1234 --force
```

_See code: [src/commands/game/export.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/export.ts)_

## `shipthis game ios app create`

Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios app create [-g <value>] [-n <value>] [-b <value>]

FLAGS
  -b, --bundleId=<value>  The BundleId in the Apple Developer Portal
  -g, --gameId=<value>    The ID of the game
  -n, --appName=<value>   The name of the App in the Apple Developer Portal

DESCRIPTION
  Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios app create
```

_See code: [src/commands/game/ios/app/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/app/create.ts)_

## `shipthis game ios app status`

Shows the Game iOS App status. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios app status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game iOS App status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios app status
```

_See code: [src/commands/game/ios/app/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/app/status.ts)_

## `shipthis game ios app sync`

Synchronies the Apple App "BundleId" with the capabilities from the local project. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios app sync [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Synchronies the Apple App "BundleId" with the capabilities from the local project. If --gameId is not provided it will
  look in the current directory.

EXAMPLES
  $ shipthis game ios app sync
```

_See code: [src/commands/game/ios/app/sync.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/app/sync.ts)_

## `shipthis game ios profile create`

Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios profile create [-g <value>] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the
  current directory.

EXAMPLES
  $ shipthis game ios profile create
```

_See code: [src/commands/game/ios/profile/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/create.ts)_

## `shipthis game ios profile export FILE`

Saves the current Mobile Provisioning Profile to a ZIP file

```
USAGE
  $ shipthis game ios profile export FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Saves the current Mobile Provisioning Profile to a ZIP file

EXAMPLES
  $ shipthis game ios profile export userProfile.zip
```

_See code: [src/commands/game/ios/profile/export.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/export.ts)_

## `shipthis game ios profile import FILE`

Imports an Mobile Provisioning Profile to your ShipThis account

```
USAGE
  $ shipthis game ios profile import FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Imports an Mobile Provisioning Profile to your ShipThis account

EXAMPLES
  $ shipthis game ios profile import profile.zip
```

_See code: [src/commands/game/ios/profile/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/import.ts)_

## `shipthis game ios profile status`

Shows the Game iOS Mobile Provisioning Profile Status. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios profile status [-g <value>] [-f]

FLAGS
  -f, --noAppleAuth
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game iOS Mobile Provisioning Profile Status. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios profile status
```

_See code: [src/commands/game/ios/profile/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/status.ts)_

## `shipthis game ios status`

Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios status

  $ shipthis game ios status --gameId 0c179fc4
```

_See code: [src/commands/game/ios/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/status.ts)_

## `shipthis game job list`

Lists the jobs for a game. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game job list [-g <value>] [-p <value>] [-s <value>] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=<value>      The ID of the game
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the jobs for a game. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game job list

  $ shipthis game job list --gameId 0c179fc4
```

_See code: [src/commands/game/job/list.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/job/list.ts)_

## `shipthis game job status JOB_ID`

Shows the real-time status of a job.

```
USAGE
  $ shipthis game job status JOB_ID [-g <value>] [-n <value>] [-f]

ARGUMENTS
  JOB_ID  The id of the job to get the status of

FLAGS
  -f, --follow          Follow the log in real-time
  -g, --gameId=<value>  The ID of the game
  -n, --lines=<value>   [default: 10] The number of lines to show

DESCRIPTION
  Shows the real-time status of a job.

EXAMPLES
  $ shipthis game job status 4d32239e

  $ shipthis game job status --gameId 0c179fc4 4d32239e

  $ shipthis game job status --gameId 0c179fc4 --lines 20 --follow 4d32239e
```

_See code: [src/commands/game/job/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/job/status.ts)_

## `shipthis game list`

Shows a list of all your games

```
USAGE
  $ shipthis game list [-p <value>] [-s <value>] [-o createdAt|updatedAt|name] [-r asc|desc]

FLAGS
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt|name>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Shows a list of all your games

EXAMPLES
  $ shipthis game list
```

_See code: [src/commands/game/list.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/list.ts)_

## `shipthis game ship`

Builds the app (for all platforms with valid credentials) and ships it to the stores

```
USAGE
  $ shipthis game ship [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Builds the app (for all platforms with valid credentials) and ships it to the stores

EXAMPLES
  $ shipthis game ship
```

_See code: [src/commands/game/ship.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ship.ts)_

## `shipthis game status`

Shows the Game status. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game status

  $ shipthis game status --gameId 0c179fc4
```

_See code: [src/commands/game/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/status.ts)_

## `shipthis game version`

Shows and sets the game semantic version and build number. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game version [-g <value>] [-b <value>] [-s <value>]

FLAGS
  -b, --setBuildNumber=<value>      Set the build number
  -g, --gameId=<value>              The ID of the game
  -s, --setSemanticVersion=<value>  Set the semantic version

DESCRIPTION
  Shows and sets the game semantic version and build number. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game version

  $ shipthis game version --gameId 0c179fc4

  $ shipthis game version --setBuildNumber 5 --setSemanticVersion 1.2.3
```

_See code: [src/commands/game/version.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/version.ts)_

## `shipthis help [COMMAND]`

Display help for shipthis.

```
USAGE
  $ shipthis help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for shipthis.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.10/src/commands/help.ts)_

## `shipthis login`

Authenticate - will create a new account if one does not exist.

```
USAGE
  $ shipthis login [-f] [-e <value>]

FLAGS
  -e, --email=<value>  Your email address
  -f, --force

DESCRIPTION
  Authenticate - will create a new account if one does not exist.

EXAMPLES
  $ shipthis login

  $ shipthis login --force --email me@email.nowhere
```

_See code: [src/commands/login.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/login.ts)_

## `shipthis status`

Displays the current overall status.

```
USAGE
  $ shipthis status

DESCRIPTION
  Displays the current overall status.

EXAMPLES
  $ shipthis status
```

_See code: [src/commands/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/status.ts)_
<!-- commandsstop -->
