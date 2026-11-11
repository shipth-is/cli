# Command: `game encryption export`

## Description

Prints the encryption key of a game, or writes it to a file, so you can use it in your own Godot exports.

## Help Output

```help
USAGE
  $ shipthis game encryption export [FILE] [-g <value>] [-f]

ARGUMENTS
  [FILE]  Name of the file to write the key to. Prints the key if not given

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Prints the encryption key of a game, or writes it to a file, so you can use it in your own Godot exports.

EXAMPLES
  $ shipthis game encryption export

  $ shipthis game encryption export key.txt

  $ shipthis game encryption export key.txt --force

  $ shipthis game encryption export --gameId 0c179fc4
```