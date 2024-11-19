`shipthis game:export`
======================

Downloads the shipthis.json file for a given game into the current directory.

* [`shipthis game export GAME_ID`](#shipthis-game-export-game_id)

## `shipthis game export GAME_ID`

Downloads the shipthis.json file for a given game into the current directory.

```
USAGE
  $ shipthis game export GAME_ID [-f]

ARGUMENTS
  GAME_ID  The ID of the game to export (use "list" to get the ID)

FLAGS
  -f, --force

DESCRIPTION
  Downloads the shipthis.json file for a given game into the current directory.

EXAMPLES
  $ shipthis game export abcd1234

  $ shipthis game export abcd1234 --force
```

_See code: [src/commands/game/export.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/export.ts)_
