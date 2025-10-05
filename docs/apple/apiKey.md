# Topic: `apple apiKey`

## Description

Commands in the apple apiKey topic are prefixed `shipthis apple apiKey`. These commands relate to App Store Connect API Keys.

- You can view the App Store Connect API Keys in the [Apple Developer Portal](https://appstoreconnect.apple.com/access/integrations/api).
- You can view the keys which ShipThis can use in the [ShipThis Dashboard](https://shipth.is/credentials).

:::info
An **App Store Connect API key** is used to authenticate and authorize automated interactions with Apple's App Store Connect API, enabling tasks like managing app metadata, TestFlight, and sales reports.

**ShipThis uses one of these keys to automatically upload new builds of your games.**
:::

:::tip
You will need to be authenticated against ShipThis and Apple before you can use
these commands. To do that please run the following commands first:

- [`shipthis login`](/docs/reference/login)
- [`shipthis apple login`](/docs/reference/apple/login)

:::

## Example

[![asciicast](https://asciinema.org/a/PsCq8H4NowWSiGGMLraosAh9a.svg)](https://asciinema.org/a/PsCq8H4NowWSiGGMLraosAh9a#shipthis-col120row32)

## Commands

### `apple apiKey create`

#### Description

Creates an App Store Connect API Key in your Apple Developer account.
Saves the private key in your ShipThis account.

#### Help Output

```help
USAGE
  $ shipthis apple apiKey create [-f] [-q]

FLAGS
  -f, --force
  -q, --quiet  Avoid output except for interactions and errors

DESCRIPTION
  Creates an App Store Connect API Key in your Apple Developer account.
  Saves the private key in your ShipThis account.

EXAMPLES
  $ shipthis apple apiKey create

  $ shipthis apple apiKey create --force
```

### `apple apiKey delete`

#### Description

Delete an Apple API Key from ShipThis and optionally from Apple

#### Help Output

```help
USAGE
  $ shipthis apple apiKey delete [-i] [-y] [-a]

FLAGS
  -a, --revokeInApple  Also revoke the API Key in Apple (cannot be undone)
  -i, --immediate      Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)
  -y, --iAmSure        I am sure I want to do this - do not prompt me

DESCRIPTION
  Delete an Apple API Key from ShipThis and optionally from Apple

EXAMPLES
  $ shipthis apple apiKey delete

  $ shipthis apple apiKey delete --immediate --revokeInApple --iAmSure
```

### `apple apiKey export`

#### Description

Saves the current App Store Connect API Key to a ZIP file

#### Help Output

```help
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

### `apple apiKey import`

#### Description

Imports an App Store Connect API Key ZIP file into your ShipThis account

#### Help Output

```help
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

### `apple apiKey status`

#### Description

Displays the status of App Store Connect API Keys in your Apple and ShipThis accounts.
This API key is used to automatically publish your games to the App Store.

#### Help Output

```help
USAGE
  $ shipthis apple apiKey status [-f]

FLAGS
  -f, --noAppleAuth

DESCRIPTION
  Displays the status of App Store Connect API Keys in your Apple and ShipThis accounts.
  This API key is used to automatically publish your games to the App Store.

EXAMPLES
  $ shipthis apple apiKey status

  $ shipthis apple apiKey status --noAppleAuth
```
