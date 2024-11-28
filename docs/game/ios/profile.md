# game ios profile

Commands related to the App Store Provisioning Profiles for this Game


## Commands


### game ios profile create

#### Description

Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

#### Help Output

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

### game ios profile export

#### Description

Saves the current Mobile Provisioning Profile to a ZIP file

#### Help Output

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

### game ios profile import

#### Description

Imports an Mobile Provisioning Profile to your ShipThis account

#### Help Output

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

### game ios profile status

#### Description

Shows the Game iOS Mobile Provisioning Profile Status. If --gameId is not provided it will look in the current directory.

#### Help Output

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
