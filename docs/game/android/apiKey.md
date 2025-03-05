# Topic: `game android apiKey`

Commands related to they Android Service Account API Key for a specific game


## Commands


### `game android apiKey connect`

#### Description

Connects ShipThis with Google for managing Service Account API Keys for an Android game

#### Help Output

```help
USAGE
  $ shipthis game android apiKey connect [-g <value>] [-f] [-d]

FLAGS
  -d, --disconnect
  -f, --force
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Connects ShipThis with Google for managing Service Account API Keys for an Android game

EXAMPLES
  $ shipthis game android apiKey connect

  $ shipthis game android apiKey connect --force

  $ shipthis game android apiKey connect --disconnect
```

### `game android apiKey create`

#### Description

Creates a new Android Service Account API Key for a game

#### Help Output

```help
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

### `game android apiKey export`

#### Description

Saves the current Android Service Account API Key to a ZIP file

#### Help Output

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

### `game android apiKey import`

#### Description

Imports an Android Service Account API Key to your ShipThis account for the specified game.

#### Help Output

```help
USAGE
  $ shipthis game android apiKey import FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Imports an Android Service Account API Key to your ShipThis account for the specified game.

EXAMPLES
  $ shipthis game android apiKey import
```

### `game android apiKey invite`

#### Description

Invites the Service Account to your Google Play Account.

#### Help Output

```help
USAGE
  $ shipthis game android apiKey invite [ACCOUNTID] [-g <value>] [-p] [-p] [-w]

ARGUMENTS
  ACCOUNTID  The Google Play Account ID

FLAGS
  -g, --gameId=<value>    The ID of the game
  -p, --prompt            Prompt for the Google Play Account ID
  -p, --waitForGoogleApp  Waits for the Google Play app to be created (10 mins).
  -w, --waitForAuth       Wait for Google Authentication (10 mins).

DESCRIPTION
  Invites the Service Account to your Google Play Account.

EXAMPLES
  $ shipthis game android apiKey invite
```

### `game android apiKey status`

#### Description

Displays the status of the Android Service Account API Key for a specific game.

#### Help Output

```help
USAGE
  $ shipthis game android apiKey status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Displays the status of the Android Service Account API Key for a specific game.

EXAMPLES
  $ shipthis game android apiKey status

  $ shipthis game android apiKey status --gameId 0c179fc4
```
