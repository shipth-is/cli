shipthis
=================

Mobile Game Shipping Tool


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/shipthis.svg)](https://npmjs.org/package/shipthis)
[![Downloads/week](https://img.shields.io/npm/dw/shipthis.svg)](https://npmjs.org/package/shipthis)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shipthis
$ shipthis COMMAND
running command...
$ shipthis (--version)
shipthis/0.0.0 linux-x64 node-v21.6.1
$ shipthis --help [COMMAND]
USAGE
  $ shipthis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shipthis help [COMMAND]`](#shipthis-help-command)
* [`shipthis login`](#shipthis-login)

## `shipthis help [COMMAND]`

Display help for shipthis.

```
USAGE
  $ shipthis help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for shipthis.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.10/src/commands/help.ts)_

## `shipthis login`

Authenticate with shipthis - will create a new account if one does not exist

```
USAGE
  $ shipthis login [--json] [--log-level debug|warn|error|info|trace] [-f] [-e <value>]

FLAGS
  -e, --email=<value>  Your email address
  -f, --force

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Authenticate with shipthis - will create a new account if one does not exist

EXAMPLES
  $ shipthis login

  $ shipthis login --force --email me@email.nowhere
```

_See code: [src/commands/login.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/login.ts)_
<!-- commandsstop -->
