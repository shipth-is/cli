# Command: `game android keyStore delete`

## Description

Delete the active Android KeyStore from ShipThis

## Help Output

```help
USAGE
  $ shipthis game android keyStore delete [-g <value>] [-i] [-y]

FLAGS
  -g, --gameId=<value>  The ID of the game
  -i, --immediate       Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)
  -y, --iAmSure         I am sure I want to do this - do not prompt me

DESCRIPTION
  Delete the active Android KeyStore from ShipThis

EXAMPLES
  $ shipthis game android keyStore delete
```