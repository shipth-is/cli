# game build list

```
USAGE
  $ shipthis game build list [-g &lt;value&gt;] [-p &lt;value&gt;] [-s &lt;value&gt;] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=&lt;value&gt;      The ID of the game
  -o, --orderBy=&lt;option&gt;    [default: createdAt] The field to order by
                            &lt;options: createdAt|updatedAt&gt;
  -p, --pageNumber=&lt;value&gt;  The page number to show (starts at 0)
  -r, --order=&lt;option&gt;      [default: desc] The order to sort by
                            &lt;options: asc|desc&gt;
  -s, --pageSize=&lt;value&gt;    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the builds for successful jobs of a game.

EXAMPLES
  $ shipthis game build list

  $ shipthis game build list --gameId 0c179fc4

  $ shipthis game build list --gameId 0c179fc4 --pageSize 20 --pageNumber 1
```