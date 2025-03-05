# Command: `game export`

## Description

Downloads the shipthis.json file for a given game into the current directory.

## Example

[![asciicast](https://asciinema.org/a/kAclG6bghhwuXWP4E5NUssAfA.svg)](https://asciinema.org/a/kAclG6bghhwuXWP4E5NUssAfA#shipthis-col100row32)

## Help Output

```help
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