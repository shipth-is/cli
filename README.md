shipthis
=================

# Develomnent Notes

To build and run locally:

```
npm run build
npm link
```

When you add or remove a command you will need to update the `"exports"` section in the `package.json` file using:

```
find src/commands/ -type f | sed "s/src\([^\.]*\)\..*$/dist\1.js/g"
```

# Introduction

Mobile Game Shipping Tool

[![Version](https://img.shields.io/npm/v/shipthis.svg)](https://npmjs.org/package/shipthis)
[![Downloads/week](https://img.shields.io/npm/dw/shipthis.svg)](https://npmjs.org/package/shipthis)


<!-- toc -->
* [Develomnent Notes](#develomnent-notes)
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
shipthis/0.0.0 linux-x64 node-v21.6.1
$ shipthis --help [COMMAND]
USAGE
  $ shipthis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shipthis apple certificate create [FILE]`](#shipthis-apple-certificate-create-file)
* [`shipthis apple certificate import [FILE]`](#shipthis-apple-certificate-import-file)
* [`shipthis apple certificate status [FILE]`](#shipthis-apple-certificate-status-file)
* [`shipthis apple login`](#shipthis-apple-login)
* [`shipthis apple status`](#shipthis-apple-status)
* [`shipthis game create`](#shipthis-game-create)
* [`shipthis game ios apiKey create [FILE]`](#shipthis-game-ios-apikey-create-file)
* [`shipthis game ios apiKey import [FILE]`](#shipthis-game-ios-apikey-import-file)
* [`shipthis game ios apiKey status [FILE]`](#shipthis-game-ios-apikey-status-file)
* [`shipthis game ios app create [FILE]`](#shipthis-game-ios-app-create-file)
* [`shipthis game ios app status [FILE]`](#shipthis-game-ios-app-status-file)
* [`shipthis game ios profile create [FILE]`](#shipthis-game-ios-profile-create-file)
* [`shipthis game ios profile import [FILE]`](#shipthis-game-ios-profile-import-file)
* [`shipthis game ios profile status [FILE]`](#shipthis-game-ios-profile-status-file)
* [`shipthis game ios status [FILE]`](#shipthis-game-ios-status-file)
* [`shipthis game list`](#shipthis-game-list)
* [`shipthis game ship`](#shipthis-game-ship)
* [`shipthis game status`](#shipthis-game-status)
* [`shipthis help [COMMAND]`](#shipthis-help-command)
* [`shipthis login`](#shipthis-login)
* [`shipthis status`](#shipthis-status)

## `shipthis apple certificate create [FILE]`

describe the command here

```
USAGE
  $ shipthis apple certificate create [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis apple certificate create
```

_See code: [src/commands/apple/certificate/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/create.ts)_

## `shipthis apple certificate import [FILE]`

describe the command here

```
USAGE
  $ shipthis apple certificate import [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis apple certificate import
```

_See code: [src/commands/apple/certificate/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/apple/certificate/import.ts)_

## `shipthis apple certificate status [FILE]`

describe the command here

```
USAGE
  $ shipthis apple certificate status [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis apple certificate status
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

## `shipthis game ios apiKey create [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios apiKey create [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios apiKey create
```

_See code: [src/commands/game/ios/apiKey/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/apiKey/create.ts)_

## `shipthis game ios apiKey import [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios apiKey import [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios apiKey import
```

_See code: [src/commands/game/ios/apiKey/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/apiKey/import.ts)_

## `shipthis game ios apiKey status [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios apiKey status [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios apiKey status
```

_See code: [src/commands/game/ios/apiKey/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/apiKey/status.ts)_

## `shipthis game ios app create [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios app create [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios app create
```

_See code: [src/commands/game/ios/app/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/app/create.ts)_

## `shipthis game ios app status [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios app status [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios app status
```

_See code: [src/commands/game/ios/app/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/app/status.ts)_

## `shipthis game ios profile create [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios profile create [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios profile create
```

_See code: [src/commands/game/ios/profile/create.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/create.ts)_

## `shipthis game ios profile import [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios profile import [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios profile import
```

_See code: [src/commands/game/ios/profile/import.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/import.ts)_

## `shipthis game ios profile status [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios profile status [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios profile status
```

_See code: [src/commands/game/ios/profile/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/profile/status.ts)_

## `shipthis game ios status [FILE]`

describe the command here

```
USAGE
  $ shipthis game ios status [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ shipthis game ios status
```

_See code: [src/commands/game/ios/status.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/game/ios/status.ts)_

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
  $ shipthis game ship

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
