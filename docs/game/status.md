# Command: `game status`

## Description

Shows the status of a specific game (generally in the currently directory).

## Example

[![asciicast](https://asciinema.org/a/cv0VHq15A7aHklMM1QSgCnDYT.svg)](https://asciinema.org/a/cv0VHq15A7aHklMM1QSgCnDYT)

## Help Output

```help
USAGE
  $ shipthis game status [-g <value>] [-p android|ios]

FLAGS
  -g, --gameId=<value>     The ID of the game
  -p, --platform=<option>  The platform to check status for (ios, android)
                           <options: android|ios>

DESCRIPTION
  Shows the status of the current game.

EXAMPLES
  $ shipthis game status

  $ shipthis game status --gameId 0c179fc4

  $ shipthis game status --platform ios
```