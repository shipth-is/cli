# game:build

Commands related to builds for a specific game


## Commands

# game build download

```
USAGE
  $ shipthis game build download BUILD_ID FILE [-g &amp;lt;value&amp;gt;] [-f]

ARGUMENTS
  BUILD_ID  The ID of the build to download
  FILE      Name of the file to output

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=&amp;lt;value&amp;gt;  The ID of the game

DESCRIPTION
  Downloads the given build artifact to the specified file

EXAMPLES
  $ shipthis game build download 7a3f5c92 output.ipa

  $ shipthis game build download --gameId 0c179fc4 e4b9a3d7 output.apk
```

# game build list

```
USAGE
  $ shipthis game build list [-g &amp;lt;value&amp;gt;] [-p &amp;lt;value&amp;gt;] [-s &amp;lt;value&amp;gt;] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=&amp;lt;value&amp;gt;      The ID of the game
  -o, --orderBy=&amp;lt;option&amp;gt;    [default: createdAt] The field to order by
                            &amp;lt;options: createdAt|updatedAt&amp;gt;
  -p, --pageNumber=&amp;lt;value&amp;gt;  The page number to show (starts at 0)
  -r, --order=&amp;lt;option&amp;gt;      [default: desc] The order to sort by
                            &amp;lt;options: asc|desc&amp;gt;
  -s, --pageSize=&amp;lt;value&amp;gt;    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the builds for successful jobs of a game.

EXAMPLES
  $ shipthis game build list

  $ shipthis game build list --gameId 0c179fc4

  $ shipthis game build list --gameId 0c179fc4 --pageSize 20 --pageNumber 1
```
