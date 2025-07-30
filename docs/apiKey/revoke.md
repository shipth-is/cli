# Command: `apiKey revoke`

## Description

Revokes a specific ShipThis API key.

## Help Output

```help
USAGE
  $ shipthis apiKey revoke APIKEYID [-q]

ARGUMENTS
  APIKEYID  The ID of the API key to revoke

FLAGS
  -q, --quiet  Suppress output except for errors

DESCRIPTION
  Revokes a specific ShipThis API key.

EXAMPLES
  $ shipthis apiKey revoke abcd1234

  $ shipthis apiKey revoke abcd1234 --quiet
```