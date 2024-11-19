`shipthis apple:login`
======================

Authenticate with Apple - saves the session to the auth file

* [`shipthis apple login`](#shipthis-apple-login)

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
