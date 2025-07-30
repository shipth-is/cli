# Command: `apiKey list`

## Description

Displays a list of your ShipThis API keys.

## Help Output

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