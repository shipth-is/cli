`shipthis apple:certificate`
============================

Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account

* [`shipthis apple certificate create`](#shipthis-apple-certificate-create)
* [`shipthis apple certificate export FILE`](#shipthis-apple-certificate-export-file)
* [`shipthis apple certificate import FILE`](#shipthis-apple-certificate-import-file)
* [`shipthis apple certificate status`](#shipthis-apple-certificate-status)

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
