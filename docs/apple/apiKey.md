# apple:apiKey

Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account


## Commands


### apple apiKey create

Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account

#### Help Output

```
USAGE
  $ shipthis apple apiKey create [-f] [-q]

FLAGS
  -f, --force
  -q, --quiet  Avoid output except for interactions and errors

DESCRIPTION
  Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis
  account

EXAMPLES
  $ shipthis apple apiKey create

  $ shipthis apple apiKey create --force
```

### apple apiKey export

Saves the current App Store Connect API Key to a ZIP file

#### Help Output

```
USAGE
  $ shipthis apple apiKey export FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force  Overwrite the file if it already exists

DESCRIPTION
  Saves the current App Store Connect API Key to a ZIP file

EXAMPLES
  $ shipthis apple apiKey export userApiKey.zip
```

### apple apiKey import

Imports an App Store Connect API Key ZIP file into your ShipThis account

#### Help Output

```
USAGE
  $ shipthis apple apiKey import FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force

DESCRIPTION
  Imports an App Store Connect API Key ZIP file into your ShipThis account

EXAMPLES
  $ shipthis apple apiKey import userApiKey.zip
```

### apple apiKey status

Displays the status of the App Store Connect API Keys in your Apple and ShipThis accounts. The API key is used to automatically publish your games to the App Store.

#### Help Output

```
USAGE
  $ shipthis apple apiKey status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of the App Store Connect API Keys in your Apple and ShipThis accounts. The API key is used to
  automatically publish your games to the App Store.

EXAMPLES
  $ shipthis apple apiKey status

  $ shipthis apple apiKey status --noAppleAuth
```
