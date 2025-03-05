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

[![asciicast](https://asciinema.org/a/h2wLhEFVy8mLA5dE6hb1gHDyD.svg)](https://asciinema.org/a/h2wLhEFVy8mLA5dE6hb1gHDyD)


## Help Output

```help
USAGE
  $ shipthis apple login [-q] [-f] [-e <value>]

FLAGS
  -e, --appleEmail=<value>  Your Apple Developer email address
  -f, --force
  -q, --quiet               Avoid output except for interactions and errors

DESCRIPTION
  Authenticate with Apple - saves the session to the auth file

EXAMPLES
  $ shipthis apple login

  $ shipthis apple login --force --appleEmail me@email.nowhere
```