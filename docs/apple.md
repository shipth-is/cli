# Topic: `apple`

Commands in the Apple topic are prefixed `shipthis apple`. They relate to linking your ShipThis account with your Apple Developer Account. You need to be authenticated against ShipThis (by running [`shipthis login`](/docs/reference/login)) before running the Apple commands.

## Status

Display the status of your ShipThis integration with your Apple Developer account.

- [`shipthis apple status`](/docs/reference/apple/status)

## Login

Authenticate against the Apple API and persists the session cookies so that you do not need to re-authenticate between commands.

:::tip Info
Your Apple credentials never leave your computer. ShipThis saves the cookies to `~/.shipthis.auth.json`

:::

- [`shipthis apple login`](/docs/reference/apple/login)

# Apple Topics

## API Keys

Manage App Store Connect API Keys in your Apple Developer account and their corresponding private keys in your ShipThis account

:::tip Info
App Store Connect API Keys are used to upload your game to the App Store. The same API key can be used to upload multiple games.
:::

- [`shipthis apple apiKey create`](/docs/reference/apple/apiKey#apple-apikey-create)
- [`shipthis apple apiKey delete`](/docs/reference/apple/apiKey#apple-apikey-delete)
- [`shipthis apple apiKey export FILE`](/docs/reference/apple/apiKey#apple-apikey-export)
- [`shipthis apple apiKey import FILE`](/docs/reference/apple/apiKey#apple-apikey-import)
- [`shipthis apple apiKey status`](/docs/reference/apple/apiKey#apple-apikey-status)

## Certificates

Manage iOS Distribution Certificates in your Apple Developer account and their corresponding private keys in your ShipThis account

:::tip Info
Your iOS Distribution Certificate is used to sign all of your games before upload to the App Store. The same certificate can be used to sign multiple games.
:::

- [`shipthis apple certificate create`](/docs/reference/apple/certificate#apple-certificate-create)
- [`shipthis apple certificate delete`](/docs/reference/apple/certificate#apple-certificate-delete)
- [`shipthis apple certificate export FILE`](/docs/reference/apple/certificate#apple-certificate-export)
- [`shipthis apple certificate import FILE`](/docs/reference/apple/certificate#apple-certificate-import)
- [`shipthis apple certificate show`](/docs/reference/apple/certificate#apple-certificate-show)
- [`shipthis apple certificate status`](/docs/reference/apple/certificate#apple-certificate-status)
