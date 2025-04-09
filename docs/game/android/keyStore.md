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
