`shipthis game:ios`
===================

Commands related to the iOS platform for a specific game

* [`shipthis game ios app addTester`](#shipthis-game-ios-app-addtester)
* [`shipthis game ios app create`](#shipthis-game-ios-app-create)
* [`shipthis game ios app status`](#shipthis-game-ios-app-status)
* [`shipthis game ios app sync`](#shipthis-game-ios-app-sync)
* [`shipthis game ios profile create`](#shipthis-game-ios-profile-create)
* [`shipthis game ios profile export FILE`](#shipthis-game-ios-profile-export-file)
* [`shipthis game ios profile import FILE`](#shipthis-game-ios-profile-import-file)
* [`shipthis game ios profile status`](#shipthis-game-ios-profile-status)
* [`shipthis game ios status`](#shipthis-game-ios-status)

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
