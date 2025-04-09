# Topic: `game android`

Commands related to the Android platform for a specific game

## Topics


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


# Topic: `game android keyStore`

Commands related to the Android KeyStore for a specific game


## Commands


### `game android keyStore create`

#### Description

Creates a new Android Keystore for a game

#### Help Output

```help
USAGE
  $ shipthis game android keyStore create [-g <value>] [-f]

FLAGS
  -f, --force
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Creates a new Android Keystore for a game

EXAMPLES
  $ shipthis game android keyStore create

  $ shipthis game android keyStore create --gameId 0c179fc4
```

### `game android keyStore export`

#### Description

Saves the current Android Keystore to a ZIP file

#### Help Output

```help
USAGE
  $ shipthis game android keyStore export FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Saves the current Android Keystore to a ZIP file

EXAMPLES
  $ shipthis game android keyStore export keyStore.zip
```

### `game android keyStore import`

#### Description

Imports an Android Keystore to your ShipThis account for the specified game.

#### Help Output

```help
USAGE
  $ shipthis game android keyStore import [FILE] [-g <value>] [--jksFile <value>] [--keystorePassword <value>] [--keyPassword
    <value>] [-f]

ARGUMENTS
  FILE  Path to the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force                     Overwrite any existing keystore without confirmation
  -g, --gameId=<value>            The ID of the game
      --jksFile=<value>           Path to the JKS file to import (requires passwords)
      --keyPassword=<value>       Key alias password (required when using --jksFile)
      --keystorePassword=<value>  Keystore password (required when using --jksFile)

DESCRIPTION
  Imports an Android Keystore to your ShipThis account for the specified game.

EXAMPLES
  $ shipthis game android keyStore import path/to/import.zip -g abfd5b00

  $ shipthis game android keyStore import --jksFile path/to/file.jks --keystorePassword yourpass --keyPassword yourkeypass
```

### `game android keyStore status`

#### Description

Displays the status of the Android Keystore for a specific game.

#### Help Output

```help
USAGE
  $ shipthis game android keyStore status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Displays the status of the Android Keystore for a specific game.

EXAMPLES
  $ shipthis game android keyStore status

  $ shipthis game android keyStore status --gameId 0c179fc4
```


## Commands


### `game android status`

#### Description

Shows the status of the setup for the Android platform for a specific game.

#### Help Output

```help
USAGE
  $ shipthis game android status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows the status of the setup for the Android platform for a specific game.

EXAMPLES
  $ shipthis game android status

  $ shipthis game android status --gameId 0c179fc4
```
