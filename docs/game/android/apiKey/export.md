# Command: `game android apiKey export`

## Description

Saves the current Android Service Account API Key to a ZIP file

## Help Output

```help
USAGE
  $ shipthis game android apiKey export FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Saves the current Android Service Account API Key to a ZIP file

EXAMPLES
  $ shipthis game android apiKey export keyStore.zip
```