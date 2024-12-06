# Command: `login`

## Description

Authenticate - will create a new account if one does not exist.

:::info
ShipThis is a cloud build command-line tool. To enable this, you need to create
an account. There is also a [web dashboard](/dashboard) where you can view details
of your games.
:::

## Example

[![asciicast](https://asciinema.org/a/jPd9Mqafw98hEj4KEtkZod3ny.svg)](https://asciinema.org/a/jPd9Mqafw98hEj4KEtkZod3ny)

## Help Output

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