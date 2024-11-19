`shipthis apple`
================

Commands related to Apple Developer Portal

* [`shipthis apple apiKey create`](#shipthis-apple-apikey-create)
* [`shipthis apple apiKey export FILE`](#shipthis-apple-apikey-export-file)
* [`shipthis apple apiKey import FILE`](#shipthis-apple-apikey-import-file)
* [`shipthis apple apiKey status`](#shipthis-apple-apikey-status)
* [`shipthis apple certificate create`](#shipthis-apple-certificate-create)
* [`shipthis apple certificate export FILE`](#shipthis-apple-certificate-export-file)
* [`shipthis apple certificate import FILE`](#shipthis-apple-certificate-import-file)
* [`shipthis apple certificate status`](#shipthis-apple-certificate-status)
* [`shipthis apple login`](#shipthis-apple-login)
* [`shipthis apple status`](#shipthis-apple-status)

## `shipthis apple apiKey create`

Creates an App Store Connect API Key in your Apple Developer account and saves the private key in your ShipThis account

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

_See code: [src/commands/apple/apiKey/create.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/apiKey/create.ts)_

## `shipthis apple apiKey export FILE`

Saves the current App Store Connect API Key to a ZIP file

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

_See code: [src/commands/apple/apiKey/export.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/apiKey/export.ts)_

## `shipthis apple apiKey import FILE`

Imports an App Store Connect API Key ZIP file into your ShipThis account

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

_See code: [src/commands/apple/apiKey/import.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/apiKey/import.ts)_

## `shipthis apple apiKey status`

Displays the status of the App Store Connect API Keys in your Apple and ShipThis accounts. The API key is used to automatically publish your games to the App Store.

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

_See code: [src/commands/apple/apiKey/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/apiKey/status.ts)_

## `shipthis apple certificate create`

Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account

```
USAGE
  $ shipthis apple certificate create [-f] [-q]

FLAGS
  -f, --force
  -q, --quiet  Avoid output except for interactions and errors

DESCRIPTION
  Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your
  ShipThis account

EXAMPLES
  $ shipthis apple certificate create

  $ shipthis apple certificate create --force
```

_See code: [src/commands/apple/certificate/create.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/certificate/create.ts)_

## `shipthis apple certificate export FILE`

Saves the current Apple Distribution Certificate to a ZIP file.

```
USAGE
  $ shipthis apple certificate export FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force  Overwrite the file if it already exists

DESCRIPTION
  Saves the current Apple Distribution Certificate to a ZIP file.

EXAMPLES
  $ shipthis apple certificate export userCert.zip
```

_See code: [src/commands/apple/certificate/export.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/certificate/export.ts)_

## `shipthis apple certificate import FILE`

Imports an iOS Distribution Certificate to your ShipThis account

```
USAGE
  $ shipthis apple certificate import FILE [-f]

ARGUMENTS
  FILE  Name of the ZIP file to import (must be in the same format as the export)

FLAGS
  -f, --force

DESCRIPTION
  Imports an iOS Distribution Certificate to your ShipThis account

EXAMPLES
  $ shipthis apple certificate import userCert.zip
```

_See code: [src/commands/apple/certificate/import.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/certificate/import.ts)_

## `shipthis apple certificate status`

Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign all of your iOS apps.

```
USAGE
  $ shipthis apple certificate status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign
  all of your iOS apps.

EXAMPLES
  $ shipthis apple certificate status

  $ shipthis apple certificate status --noAppleAuth
```

_See code: [src/commands/apple/certificate/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/certificate/status.ts)_

## `shipthis apple login`

Authenticate with Apple - saves the session to the auth file

```
USAGE
  $ shipthis apple login [-q] [-f] [-e <value>]

FLAGS
  -e, --appleEmail=<value>  Your Apple email address
  -f, --force
  -q, --quiet               Avoid output except for interactions and errors

DESCRIPTION
  Authenticate with Apple - saves the session to the auth file

EXAMPLES
  $ shipthis apple login

  $ shipthis apple login --force --appleEmail me@email.nowhere
```

_See code: [src/commands/apple/login.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/login.ts)_

## `shipthis apple status`

Shows the status of the Apple authentication and integration

```
USAGE
  $ shipthis apple status

DESCRIPTION
  Shows the status of the Apple authentication and integration

EXAMPLES
  $ shipthis apple status
```

_See code: [src/commands/apple/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/apple/status.ts)_
