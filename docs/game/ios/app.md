# game ios app

Commands related to the App Store App for a specific game


## Commands


### game ios app addTester

#### Description

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

#### Description

Creates an App and BundleId in the Apple Developer Portal.

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
  Creates an App and BundleId in the Apple Developer Portal.

EXAMPLES
  $ shipthis game ios app create
```

### game ios app status

#### Description

Shows the Game iOS App status. 

#### Help Output

```
USAGE
  $ shipthis game ios app status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game iOS App status.

EXAMPLES
  $ shipthis game ios app status
```

### game ios app sync

#### Description

Synchronies the Apple App &#34;BundleId&#34; with the capabilities from the local project.

#### Help Output

```
USAGE
  $ shipthis game ios app sync [-q] [-g <value>] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Synchronies the Apple App "BundleId" with the capabilities from the local project.

EXAMPLES
  $ shipthis game ios app sync
```
