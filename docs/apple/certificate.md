# Topic: `apple certificate`

Commands related to App Store Certificates


## Commands


### apple certificate create

#### Description

Creates an iOS Distribution Certificate in your Apple Developer account.
Saves the certificate with the private key to your ShipThis account

#### Help Output

```
USAGE
  $ shipthis apple certificate create [-f] [-q]

FLAGS
  -f, --force
  -q, --quiet  Avoid output except for interactions and errors

DESCRIPTION
  Creates an iOS Distribution Certificate in your Apple Developer account.
  Saves the certificate with the private key to your ShipThis account

EXAMPLES
  $ shipthis apple certificate create

  $ shipthis apple certificate create --force
```

### apple certificate export

#### Description

Saves the current Apple Distribution Certificate to a ZIP file.

#### Help Output

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

### apple certificate import

#### Description

Imports an iOS Distribution Certificate to your ShipThis account

#### Help Output

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

### apple certificate status

#### Description

Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts.
These are used to sign all of your iOS apps.

#### Help Output

```
USAGE
  $ shipthis apple certificate status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts.
  These are used to sign all of your iOS apps.

EXAMPLES
  $ shipthis apple certificate status

  $ shipthis apple certificate status --noAppleAuth
```
