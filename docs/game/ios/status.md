# Command: `game ios status`

## Description

Displays the overall status of the iOS configuration for the current game. This
includes the [App & BundleId](/docs/reference/game/ios/app) and the [Provisioning Profile](/docs/reference/game/ios/profile).

## Example

[![asciicast](https://asciinema.org/a/YvwnDYtINKsJD6Fpicg6UdjPT.svg)](https://asciinema.org/a/YvwnDYtINKsJD6Fpicg6UdjPT#shipthis-col120row32)

## Help Output

```help
USAGE
  $ shipthis game ios status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game ios status

  $ shipthis game ios status --gameId 0c179fc4
```