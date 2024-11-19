`shipthis game`
===============

Commands related to Game Management

* [`shipthis game build download BUILD_ID FILE`](#shipthis-game-build-download-build_id-file)
* [`shipthis game build list`](#shipthis-game-build-list)
* [`shipthis game create`](#shipthis-game-create)
* [`shipthis game details`](#shipthis-game-details)
* [`shipthis game export GAME_ID`](#shipthis-game-export-game_id)
* [`shipthis game ios app addTester`](#shipthis-game-ios-app-addtester)
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
* [`shipthis game wizard`](#shipthis-game-wizard)

## `shipthis game build download BUILD_ID FILE`

Downloads the given build artifact to the specified file

```
USAGE
  $ shipthis game build download BUILD_ID FILE [-g <value>] [-f]

ARGUMENTS
  BUILD_ID  The ID of the build to download
  FILE      Name of the file to output

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Downloads the given build artifact to the specified file

EXAMPLES
  $ shipthis game build download 7a3f5c92 output.ipa

  $ shipthis game build download --gameId 0c179fc4 e4b9a3d7 output.apk
```

_See code: [src/commands/game/build/download.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/build/download.ts)_

## `shipthis game build list`

Lists the builds for successful jobs of a game.

```
USAGE
  $ shipthis game build list [-g <value>] [-p <value>] [-s <value>] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=<value>      The ID of the game
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the builds for successful jobs of a game.

EXAMPLES
  $ shipthis game build list

  $ shipthis game build list --gameId 0c179fc4

  $ shipthis game build list --gameId 0c179fc4 --pageSize 20 --pageNumber 1
```

_See code: [src/commands/game/build/list.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/build/list.ts)_

## `shipthis game create`

Create a new game

```
USAGE
  $ shipthis game create [-q] [-f] [-n <value>]

FLAGS
  -f, --force
  -n, --name=<value>  The name of the game
  -q, --quiet         Avoid output except for interactions and errors

DESCRIPTION
  Create a new game

EXAMPLES
  $ shipthis game create
```

_See code: [src/commands/game/create.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/create.ts)_

## `shipthis game details`

Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game details [-g <value>] [-f] [-b <value>] [-s <value>] [-e <value>] [-v <value>] [-i <value>] [-a
    <value>]

FLAGS
  -a, --androidPackageName=<value>  Set the Android package name
  -b, --buildNumber=<value>         Set the build number
  -e, --gameEngine=<value>          Set the game engine
  -f, --force                       Force the command to run
  -g, --gameId=<value>              The ID of the game
  -i, --iosBundleId=<value>         Set the iOS bundle ID
  -s, --semanticVersion=<value>     Set the semantic version
  -v, --gameEngineVersion=<value>   Set the game engine version

DESCRIPTION
  Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game details

  $ shipthis game details --gameId 0c179fc4

  $ shipthis game details --buildNumber 5 --semanticVersion 1.2.3

  $ shipthis game details --gameEngine godot --gameEngineVersion 4.2 --force
```

_See code: [src/commands/game/details.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/details.ts)_

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

_See code: [src/commands/game/export.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/export.ts)_

## `shipthis game ios app addTester`

Adds a test user to the game in App Store Connect.

```
USAGE
  $ shipthis game ios app addTester [-g <value>] [-e <value>] [-f <value>] [-l <value>]

FLAGS
  -e, --email=<value>      The email address of the tester
  -f, --firstName=<value>  The first name of the tester
  -g, --gameId=<value>     The ID of the game
  -l, --lastName=<value>   The last name of the tester

DESCRIPTION
  Adds a test user to the game in App Store Connect.

EXAMPLES
  $ shipthis game ios app addTester
```

_See code: [src/commands/game/ios/app/addTester.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/app/addTester.ts)_

## `shipthis game ios app create`

Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios app create [-q] [-g <value>] [-n <value>] [-b <value>] [-f]

FLAGS
  -b, --bundleId=<value>  The BundleId in the Apple Developer Portal
  -f, --force
  -g, --gameId=<value>    The ID of the game
  -n, --appName=<value>   The name of the App in the Apple Developer Portal
  -q, --quiet             Avoid output except for interactions and errors

DESCRIPTION
  Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios app create
```

_See code: [src/commands/game/ios/app/create.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/app/create.ts)_

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

_See code: [src/commands/game/ios/app/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/app/status.ts)_

## `shipthis game ios app sync`

Synchronies the Apple App "BundleId" with the capabilities from the local project. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios app sync [-q] [-g <value>] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Synchronies the Apple App "BundleId" with the capabilities from the local project. If --gameId is not provided it will
  look in the current directory.

EXAMPLES
  $ shipthis game ios app sync
```

_See code: [src/commands/game/ios/app/sync.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/app/sync.ts)_

## `shipthis game ios profile create`

Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game ios profile create [-q] [-g <value>] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the
  current directory.

EXAMPLES
  $ shipthis game ios profile create
```

_See code: [src/commands/game/ios/profile/create.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/profile/create.ts)_

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

_See code: [src/commands/game/ios/profile/export.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/profile/export.ts)_

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

_See code: [src/commands/game/ios/profile/import.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/profile/import.ts)_

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

_See code: [src/commands/game/ios/profile/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/profile/status.ts)_

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

_See code: [src/commands/game/ios/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ios/status.ts)_

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

_See code: [src/commands/game/job/list.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/job/list.ts)_

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

_See code: [src/commands/game/job/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/job/status.ts)_

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

_See code: [src/commands/game/list.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/list.ts)_

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

_See code: [src/commands/game/ship.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/ship.ts)_

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

_See code: [src/commands/game/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/status.ts)_

## `shipthis game wizard`

Runs all the steps for the specific platform

```
USAGE
  $ shipthis game wizard -p ios [-f <value>]

FLAGS
  -f, --forceStep=<value>  Force a specific step to run. You can repeat this flag to force multiple steps.
  -p, --platform=<option>  (required) The platform to run the wizard for
                           <options: ios>

DESCRIPTION
  Runs all the steps for the specific platform

EXAMPLES
  $ shipthis game wizard
```

_See code: [src/commands/game/wizard.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/wizard.ts)_
