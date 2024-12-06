# Command: `game create`

## Description

:::tip
We recommend creating your game using the [`shipthis game wizard`](/docs/reference/game/wizard).
The `shipthis game create` command is the first step run by the wizard
:::

Creates a new game in your [ShipThis account](https://shipthis.cc/games).

ShipThis will read the name of your game from your `project.godot` file. You will be
prompted to confirm this name, or you can specify one with the `--name` flag. 

If there is already a ShipThis game config file (`shipthis.json`) in the current
directory then you will need to use the `--force` flag to create a new game and
overwrite this file with the config for the new game.

ShipThis will detect the version of Godot you are using from your `project.godot`
file. This can be changed with the [`shipthis game details`](/docs/reference/game/details)
command.

## Example

[![asciicast](https://asciinema.org/a/Oxf8qnYoVViPNVA40EXKBWG36.svg)](https://asciinema.org/a/Oxf8qnYoVViPNVA40EXKBWG36)



## Help Output

```
USAGE
  $ shipthis game create [-q] [-f] [-n <value>]

FLAGS
  -f, --force
  -n, --name=<value>  The name of the game
  -q, --quiet         Avoid output except for interactions and errors

DESCRIPTION
  Create a new game in ShipThis.

EXAMPLES
  $ shipthis game create
``` 