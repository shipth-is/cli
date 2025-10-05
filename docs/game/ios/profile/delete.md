# Command: `game ios profile delete`

## Description

Delete an iOS Mobile Provisioning Profile from ShipThis and optionally from Apple

## Help Output

```help
USAGE
  $ shipthis game ios profile delete [-g <value>] [-i] [-y] [-a]

FLAGS
  -a, --revokeInApple   Also revoke the Profile in Apple (cannot be undone)
  -g, --gameId=<value>  The ID of the game
  -i, --immediate       Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)
  -y, --iAmSure         I am sure I want to do this - do not prompt me

DESCRIPTION
  Delete an iOS Mobile Provisioning Profile from ShipThis and optionally from Apple

EXAMPLES
  $ shipthis game ios profile delete

  $ shipthis game ios profile delete --revokeInApple --immediate --iAmSure
```