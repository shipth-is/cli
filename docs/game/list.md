# Command: `game list`

## Description

Shows a list of your games. Use --archived or --all to include archived games.

## Example

[![asciicast](https://asciinema.org/a/9SXrAF0ehxF7pDPu1PfKQF4q8.svg)](https://asciinema.org/a/9SXrAF0ehxF7pDPu1PfKQF4q8#shipthis-col120row32)

## Help Output

```help
USAGE
  $ shipthis game list [--all | --archived] [-r asc|desc] [-o createdAt|updatedAt|name] [-p <value>] [-s
    <value>]

FLAGS
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt|name>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page
      --all                 Show archived and active games
      --archived            Show only archived games

DESCRIPTION
  Shows a list of your games. Use --archived or --all to include archived games.

EXAMPLES
  $ shipthis game list

  $ shipthis game list --archived

  $ shipthis game list --all
```