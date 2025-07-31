# Topic: `apiKey`

Commands related to ShipThis API Keys


## Commands


### `apiKey create`

#### Description

Create a new API key for your ShipThis account.

#### Help Output

```help
USAGE
  $ shipthis apiKey create [-n <value>] [-d <value>] [-q]

FLAGS
  -d, --durationDays=<value>  [default: 365] duration of the API key in days
  -n, --name=<value>          name to apply to the API key (if not provided, a random name will be generated)
  -q, --quiet                 Outputs just the secret value

DESCRIPTION
  Create a new API key for your ShipThis account.

EXAMPLES
  $ shipthis apiKey create --durationDays 30

  $ shipthis apiKey create --name ci-key --durationDays 90

  $ shipthis apiKey create --name ci-key-headless --durationDays 365 --quiet
```

### `apiKey list`

#### Description

Displays a list of your ShipThis API keys.

#### Help Output

```help
USAGE
  $ shipthis apiKey list [-r asc|desc] [-o createdAt|updatedAt|name] [-p <value>] [-s <value>]

FLAGS
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt|name>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Displays a list of your ShipThis API keys.

EXAMPLES
  $ shipthis apiKey list

  $ shipthis apiKey list --pageNumber 1

  $ shipthis apiKey list --orderBy createdAt --order asc
```

### `apiKey revoke`

#### Description

Revokes a specific ShipThis API key.

#### Help Output

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
