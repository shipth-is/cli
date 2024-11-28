# game details

## Description

Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.

## Help Output

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