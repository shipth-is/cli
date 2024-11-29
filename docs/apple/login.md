# apple login

## Description

Authenticate with Apple - saves the session to the auth file.

## Example

[![asciicast](https://asciinema.org/a/CsYDuIS5hfO20CBS5OHbi6VUc.svg)](https://asciinema.org/a/CsYDuIS5hfO20CBS5OHbi6VUc)


## Help Output

```bash
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