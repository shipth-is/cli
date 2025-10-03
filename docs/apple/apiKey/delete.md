# Command: `apple apiKey delete`

## Description

Delete an Apple API Key from ShipThis and optionally from Apple

## Help Output

```help
USAGE
  $ shipthis apple apiKey delete [-i] [-y] [-a]

FLAGS
  -a, --revokeInApple  Also revoke the API Key in Apple (cannot be undone)
  -i, --immediate      Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)
  -y, --iAmSure        I am sure I want to do this - do not prompt me

DESCRIPTION
  Delete an Apple API Key from ShipThis and optionally from Apple

EXAMPLES
  $ shipthis apple apiKey delete

  $ shipthis apple apiKey delete --immediate --revokeInApple --iAmSure
```