# game list

```
USAGE
  $ shipthis game list [-p &lt;value&gt;] [-s &lt;value&gt;] [-o createdAt|updatedAt|name] [-r asc|desc]

FLAGS
  -o, --orderBy=&lt;option&gt;    [default: createdAt] The field to order by
                            &lt;options: createdAt|updatedAt|name&gt;
  -p, --pageNumber=&lt;value&gt;  The page number to show (starts at 0)
  -r, --order=&lt;option&gt;      [default: desc] The order to sort by
                            &lt;options: asc|desc&gt;
  -s, --pageSize=&lt;value&gt;    [default: 10] The number of items to show per page

DESCRIPTION
  Shows a list of all your games

EXAMPLES
  $ shipthis game list
```