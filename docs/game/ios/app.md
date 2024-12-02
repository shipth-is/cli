# Topic: `game ios app`

Commands related to the App Store App for a specific game


## Commands

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
