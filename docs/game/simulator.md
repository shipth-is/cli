# Command: `game simulator`

## Description

Runs the game in a simulator for the specified platform.

## Help Output

```help
USAGE
  $ shipthis game simulator PLATFORM [-g <value>] [--maxDuration <value>]

ARGUMENTS
  PLATFORM  (android|ios) The platform to run the simulator for. This can be "android" or "ios"

FLAGS
  -g, --gameId=<value>       The ID of the game
      --maxDuration=<value>  How long the simulator session may run, in seconds (default 600, max 3600)

DESCRIPTION
  Runs the game in a simulator for the specified platform.

EXAMPLES
  $ shipthis game simulator ios

  $ shipthis game simulator android

  $ shipthis game simulator android --gameId 0c179fc4

  $ shipthis game simulator ios --maxDuration 1800
```