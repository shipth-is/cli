# game:ios:app

Commands related to the App Store App for a specific game


## Commands

# game ios app addTester

```
USAGE
  $ shipthis game ios app addTester [-g &amp;lt;value&amp;gt;] [-e &amp;lt;value&amp;gt;] [-f &amp;lt;value&amp;gt;] [-l &amp;lt;value&amp;gt;]

FLAGS
  -e, --email=&amp;lt;value&amp;gt;      The email address of the tester
  -f, --firstName=&amp;lt;value&amp;gt;  The first name of the tester
  -g, --gameId=&amp;lt;value&amp;gt;     The ID of the game
  -l, --lastName=&amp;lt;value&amp;gt;   The last name of the tester

DESCRIPTION
  Adds a test user to the game in App Store Connect.

EXAMPLES
  $ shipthis game ios app addTester
```

# game ios app create

```
USAGE
  $ shipthis game ios app create [-q] [-g &amp;lt;value&amp;gt;] [-n &amp;lt;value&amp;gt;] [-b &amp;lt;value&amp;gt;] [-f]

FLAGS
  -b, --bundleId=&amp;lt;value&amp;gt;  The BundleId in the Apple Developer Portal
  -f, --force
  -g, --gameId=&amp;lt;value&amp;gt;    The ID of the game
  -n, --appName=&amp;lt;value&amp;gt;   The name of the App in the Apple Developer Portal
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
  $ shipthis game ios app status [-g &amp;lt;value&amp;gt;]

FLAGS
  -g, --gameId=&amp;lt;value&amp;gt;  The ID of the game

DESCRIPTION
  Shows the Game iOS App status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios app status
```

# game ios app sync

```
USAGE
  $ shipthis game ios app sync [-q] [-g &amp;lt;value&amp;gt;] [-f]

FLAGS
  -f, --force
  -g, --gameId=&amp;lt;value&amp;gt;  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Synchronies the Apple App &amp;#34;BundleId&amp;#34; with the capabilities from the local project. If --gameId is not provided it will
  look in the current directory.

EXAMPLES
  $ shipthis game ios app sync
```
