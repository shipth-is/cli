`shipthis game:status`
======================

Shows the Game status. If --gameId is not provided it will look in the current directory.

* [`shipthis game status`](#shipthis-game-status)

## `shipthis game status`

Shows the Game status. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the Game status. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game status

  $ shipthis game status --gameId 0c179fc4
```

_See code: [src/commands/game/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/status.ts)_
