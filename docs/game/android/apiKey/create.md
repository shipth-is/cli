# Command: `game android apiKey create`

## Description

Creates a new Android Service Account API Key for a game

## Help Output

```
USAGE
  $ shipthis game android apiKey create [-g <value>] [-w] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game
  -w, --waitForAuth     Wait for Google Authentication (10 mins).

DESCRIPTION
  Creates a new Android Service Account API Key for a game

EXAMPLES
  $ shipthis game android apiKey create

  $ shipthis game android apiKey create --gameId 0c179fc4
```