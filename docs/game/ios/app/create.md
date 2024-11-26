# game ios app create

```
USAGE
  $ shipthis game ios app create [-q] [-g &lt;value&gt;] [-n &lt;value&gt;] [-b &lt;value&gt;] [-f]

FLAGS
  -b, --bundleId=&lt;value&gt;  The BundleId in the Apple Developer Portal
  -f, --force
  -g, --gameId=&lt;value&gt;    The ID of the game
  -n, --appName=&lt;value&gt;   The name of the App in the Apple Developer Portal
  -q, --quiet             Avoid output except for interactions and errors

DESCRIPTION
  Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current
  directory.

EXAMPLES
  $ shipthis game ios app create
```