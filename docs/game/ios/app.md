# game:ios:app

Commands related to the App Store App for a specific game


## Commands


### game ios app addTester

Adds a test user to the game in App Store Connect.

#### Help Output

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

### game ios app create

Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.

#### Help Output

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

### game ios app status

Shows the Game iOS App status. If --gameId is not provided it will look in the current directory.

#### Help Output

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

### game ios app sync

Synchronies the Apple App &#34;BundleId&#34; with the capabilities from the local project. If --gameId is not provided it will look in the current directory.

#### Help Output

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
