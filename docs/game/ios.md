# game:ios

Commands related to the iOS platform for a specific game

## Topics

# game:ios:app

Commands related to the App Store App for a specific game


## Commands

# game ios app addTester

```
USAGE
  $ shipthis game ios app addTester [-g &amp;amp;lt;value&amp;amp;gt;] [-e &amp;amp;lt;value&amp;amp;gt;] [-f &amp;amp;lt;value&amp;amp;gt;] [-l &amp;amp;lt;value&amp;amp;gt;]

FLAGS
  -e, --email=&amp;amp;lt;value&amp;amp;gt;      The email address of the tester
  -f, --firstName=&amp;amp;lt;value&amp;amp;gt;  The first name of the tester
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;     The ID of the game
  -l, --lastName=&amp;amp;lt;value&amp;amp;gt;   The last name of the tester

DESCRIPTION
  Adds a test user to the game in App Store Connect.

EXAMPLES
  $ shipthis game ios app addTester
```

# game ios app create

```
USAGE
  $ shipthis game ios app create [-q] [-g &amp;amp;lt;value&amp;amp;gt;] [-n &amp;amp;lt;value&amp;amp;gt;] [-b &amp;amp;lt;value&amp;amp;gt;] [-f]

FLAGS
  -b, --bundleId=&amp;amp;lt;value&amp;amp;gt;  The BundleId in the Apple Developer Portal
  -f, --force
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;    The ID of the game
  -n, --appName=&amp;amp;lt;value&amp;amp;gt;   The name of the App in the Apple Developer Portal
  -q, --quiet             Avoid output except for interactions and errors

DESCRIPTION
  Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios app create
```

# game ios app status

```
USAGE
  $ shipthis game ios app status [-g &amp;amp;lt;value&amp;amp;gt;]

FLAGS
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game

DESCRIPTION
  Shows the Game iOS App status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios app status
```

# game ios app sync

```
USAGE
  $ shipthis game ios app sync [-q] [-g &amp;amp;lt;value&amp;amp;gt;] [-f]

FLAGS
  -f, --force
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Synchronies the Apple App &amp;amp;#34;BundleId&amp;amp;#34; with the capabilities from the local project. If --gameId is not provided it will
  look in the current directory.

EXAMPLES
  $ shipthis game ios app sync
```


# game:ios:profile

Commands related to the App Store Provisioning Profiles for this Game


## Commands

# game ios profile create

```
USAGE
  $ shipthis game ios profile create [-q] [-g &amp;amp;lt;value&amp;amp;gt;] [-f]

FLAGS
  -f, --force
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the
  current directory.

EXAMPLES
  $ shipthis game ios profile create
```

# game ios profile export

```
USAGE
  $ shipthis game ios profile export FILE [-g &amp;amp;lt;value&amp;amp;gt;] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game

DESCRIPTION
  Saves the current Mobile Provisioning Profile to a ZIP file

EXAMPLES
  $ shipthis game ios profile export userProfile.zip
```

# game ios profile import

```
USAGE
  $ shipthis game ios profile import FILE [-g &amp;amp;lt;value&amp;amp;gt;] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game

DESCRIPTION
  Imports an Mobile Provisioning Profile to your ShipThis account

EXAMPLES
  $ shipthis game ios profile import profile.zip
```

# game ios profile status

```
USAGE
  $ shipthis game ios profile status [-g &amp;amp;lt;value&amp;amp;gt;] [-f]

FLAGS
  -f, --noAppleAuth
  -g, --gameId=&amp;amp;lt;value&amp;amp;gt;  The ID of the game

DESCRIPTION
  Shows the Game iOS Mobile Provisioning Profile Status. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios profile status
```


## Commands

# game ios status

```
USAGE
  $ shipthis game ios status [-g &amp;lt;value&amp;gt;]

FLAGS
  -g, --gameId=&amp;lt;value&amp;gt;  The ID of the game

DESCRIPTION
  Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios status

  $ shipthis game ios status --gameId 0c179fc4
```
