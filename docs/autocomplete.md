# Command: `autocomplete`

## Description

Set up shell tab-completion for ShipThis CLI commands, topics, and flags.

:::tip
Autocomplete is a one-time setup. Once configured, it persists across terminal sessions and automatically covers new commands when you update the CLI.
:::

After running `shipthis autocomplete`, you can press **Tab** to:

- **Complete commands** -- type `shipthis g` then Tab to complete to `game`
- **Complete subcommands** -- type `shipthis game ` then Tab to list all game subcommands
- **Complete flags** -- type `shipthis login --` then Tab to see available flags

Supported shells: **bash**, **zsh**, and **powershell**.

## Setup

Run the following command and follow the printed instructions for your shell:

```bash
shipthis autocomplete bash
# or
shipthis autocomplete zsh
```

After updating the CLI, refresh the autocomplete cache:

```bash
shipthis autocomplete --refresh-cache
```

## Example

[![asciicast](https://asciinema.org/a/9OwiCgE62Wh5fxyJ.svg)](https://asciinema.org/a/9OwiCgE62Wh5fxyJ)

## Help Output

```help
USAGE
  $ shipthis autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ shipthis autocomplete

  $ shipthis autocomplete bash

  $ shipthis autocomplete zsh

  $ shipthis autocomplete powershell

  $ shipthis autocomplete --refresh-cache
```
