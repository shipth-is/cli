# Command: `apple login`

## Description

Authenticate with Apple - saves the session to the auth file.

:::note
Your Apple Developer credentials never leave your local computer. We recommend
enabling [two-factor authentication (2FA)](https://support.apple.com/kb/HT204915)
for your Apple ID.
:::

ShipThis makes use of Apple's APIs to manage your signing certificates, API keys,
provisioning profiles, bundleIds and apps within the Apple Developer Portal on
your behalf. To do this, ShipThis generates temporary session cookies which it re-uses between the various
[apple commands](/docs/reference/apple).

## Example

[![asciicast](https://asciinema.org/a/QK9GzErrfrY2FUkg.svg)](https://asciinema.org/a/QK9GzErrfrY2FUkg)


## Help Output

```help
USAGE
  $ shipthis apple login [-e <value>] [-f] [-q] [-l]

FLAGS
  -e, --appleEmail=<value>  Your Apple Developer email address
  -f, --force
  -l, --logout              Forget the saved Apple session (log out)
  -q, --quiet               Avoid output except for interactions and errors

DESCRIPTION
  Authenticate with Apple - saves the session to the auth file.

  Your Apple password is sent only to Apple, never to ShipThis. Only the resulting session cookies are saved locally.
  Read the source: https://github.com/shipth-is/cli/blob/main/src/commands/apple/login.ts

EXAMPLES
  $ shipthis apple login

  $ shipthis apple login --force --appleEmail me@email.nowhere

  $ shipthis apple login --logout
```