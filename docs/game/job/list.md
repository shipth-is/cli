# Command: `game job list`

## Description

Lists the jobs for a game.

## Help Output

```help
USAGE
  $ shipthis game job list [-g <value>] [-r asc|desc] [-o createdAt|updatedAt] [-p <value>] [-s <value>]

FLAGS
  -g, --gameId=<value>      The ID of the game
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the jobs for a game.

EXAMPLES
  $ shipthis game job list

  $ shipthis game job list --gameId 0c179fc4
```