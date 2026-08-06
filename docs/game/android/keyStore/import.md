# Command: `game android keyStore import`

## Description

Imports an Android Keystore to your ShipThis account for the specified game. You can import as JKS and password parameters or as a ZIP file.

## Help Output

```help
USAGE
  $ shipthis game android keyStore import [FILE] [-g <value>] [-f] [--jksFile <value>] [--keyPassword <value>] [--keystorePassword
    <value>]

ARGUMENTS
  [FILE]  Path to the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force                     Overwrite any existing keystore without confirmation
  -g, --gameId=<value>            The ID of the game
      --jksFile=<value>           Path to the JKS file to import (requires passwords)
      --keyPassword=<value>       Key alias password (required when using --jksFile)
      --keystorePassword=<value>  Keystore password (required when using --jksFile)

DESCRIPTION
  Imports an Android Keystore to your ShipThis account for the specified game. You can import as JKS and password
  parameters or as a ZIP file.

EXAMPLES
  $ shipthis game android keyStore import path/to/import.zip -g abfd5b00

  $ shipthis game android keyStore import --jksFile path/to/file.jks --keystorePassword yourpass --keyPassword yourkeypass
```