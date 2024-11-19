`shipthis login`
================

Authenticate - will create a new account if one does not exist.

* [`shipthis login`](#shipthis-login)

## `shipthis login`

Authenticate - will create a new account if one does not exist.

```
USAGE
  $ shipthis login [-f] [-e <value>]

FLAGS
  -e, --email=<value>  Your email address
  -f, --force

DESCRIPTION
  Authenticate - will create a new account if one does not exist.

EXAMPLES
  $ shipthis login

  $ shipthis login --force --email me@email.nowhere
```

_See code: [src/commands/login.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/login.ts)_
