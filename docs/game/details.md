# game details

```
USAGE
  $ shipthis game details [-g &lt;value&gt;] [-f] [-b &lt;value&gt;] [-s &lt;value&gt;] [-e &lt;value&gt;] [-v &lt;value&gt;] [-i &lt;value&gt;] [-a
    &lt;value&gt;]

FLAGS
  -a, --androidPackageName=&lt;value&gt;  Set the Android package name
  -b, --buildNumber=&lt;value&gt;         Set the build number
  -e, --gameEngine=&lt;value&gt;          Set the game engine
  -f, --force                       Force the command to run
  -g, --gameId=&lt;value&gt;              The ID of the game
  -i, --iosBundleId=&lt;value&gt;         Set the iOS bundle ID
  -s, --semanticVersion=&lt;value&gt;     Set the semantic version
  -v, --gameEngineVersion=&lt;value&gt;   Set the game engine version

DESCRIPTION
  Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game details

  $ shipthis game details --gameId 0c179fc4

  $ shipthis game details --buildNumber 5 --semanticVersion 1.2.3

  $ shipthis game details --gameEngine godot --gameEngineVersion 4.2 --force
```