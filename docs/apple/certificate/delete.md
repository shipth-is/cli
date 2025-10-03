# Command: `apple certificate delete`

## Description

Delete an iOS Distribution Certificate from ShipThis and optionally from Apple

## Help Output

```help
USAGE
  $ shipthis apple certificate delete [-i] [-y] [-a]

FLAGS
  -a, --revokeInApple  Also revoke the Certificate in Apple (cannot be undone)
  -i, --immediate      Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)
  -y, --iAmSure        I am sure I want to do this - do not prompt me

DESCRIPTION
  Delete an iOS Distribution Certificate from ShipThis and optionally from Apple

EXAMPLES
  $ shipthis apple certificate delete
```