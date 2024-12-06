# Command: `game list`

## Description

Shows a list of all your games.

## Example

[![asciicast](https://asciinema.org/a/9SXrAF0ehxF7pDPu1PfKQF4q8.svg)](https://asciinema.org/a/9SXrAF0ehxF7pDPu1PfKQF4q8#shipthis-col120row32)

## Help Output

```
USAGE
  $ shipthis game list [-p <value>] [-s <value>] [-o createdAt|updatedAt|name] [-r asc|desc]

FLAGS
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt|name>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Shows a list of all your games.

EXAMPLES
  $ shipthis game list
```