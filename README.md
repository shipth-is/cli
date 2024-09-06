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
* [`shipthis hello PERSON`](#shipthis-hello-person)
* [`shipthis hello world`](#shipthis-hello-world)
* [`shipthis help [COMMAND]`](#shipthis-help-command)
* [`shipthis plugins`](#shipthis-plugins)
* [`shipthis plugins add PLUGIN`](#shipthis-plugins-add-plugin)
* [`shipthis plugins:inspect PLUGIN...`](#shipthis-pluginsinspect-plugin)
* [`shipthis plugins install PLUGIN`](#shipthis-plugins-install-plugin)
* [`shipthis plugins link PATH`](#shipthis-plugins-link-path)
* [`shipthis plugins remove [PLUGIN]`](#shipthis-plugins-remove-plugin)
* [`shipthis plugins reset`](#shipthis-plugins-reset)
* [`shipthis plugins uninstall [PLUGIN]`](#shipthis-plugins-uninstall-plugin)
* [`shipthis plugins unlink [PLUGIN]`](#shipthis-plugins-unlink-plugin)
* [`shipthis plugins update`](#shipthis-plugins-update)

## `shipthis hello PERSON`

Say hello

```
USAGE
  $ shipthis hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ shipthis hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/hello/index.ts)_

## `shipthis hello world`

Say hello world

```
USAGE
  $ shipthis hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ shipthis hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/oclif-cli/shipthis/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `shipthis plugins`

List installed plugins.

```
USAGE
  $ shipthis plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ shipthis plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/index.ts)_

## `shipthis plugins add PLUGIN`

Installs a plugin into shipthis.

```
USAGE
  $ shipthis plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into shipthis.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SHIPTHIS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SHIPTHIS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ shipthis plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ shipthis plugins add myplugin

  Install a plugin from a github url.

    $ shipthis plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ shipthis plugins add someuser/someplugin
```

## `shipthis plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ shipthis plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ shipthis plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/inspect.ts)_

## `shipthis plugins install PLUGIN`

Installs a plugin into shipthis.

```
USAGE
  $ shipthis plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into shipthis.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SHIPTHIS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SHIPTHIS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ shipthis plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ shipthis plugins install myplugin

  Install a plugin from a github url.

    $ shipthis plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ shipthis plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/install.ts)_

## `shipthis plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ shipthis plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ shipthis plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/link.ts)_

## `shipthis plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ shipthis plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shipthis plugins unlink
  $ shipthis plugins remove

EXAMPLES
  $ shipthis plugins remove myplugin
```

## `shipthis plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ shipthis plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/reset.ts)_

## `shipthis plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ shipthis plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shipthis plugins unlink
  $ shipthis plugins remove

EXAMPLES
  $ shipthis plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/uninstall.ts)_

## `shipthis plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ shipthis plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shipthis plugins unlink
  $ shipthis plugins remove

EXAMPLES
  $ shipthis plugins unlink myplugin
```

## `shipthis plugins update`

Update installed plugins.

```
USAGE
  $ shipthis plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/update.ts)_
<!-- commandsstop -->
