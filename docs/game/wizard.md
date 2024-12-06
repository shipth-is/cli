# Command: `game wizard`

## Description

Runs all the steps for the specific platform. Please see [The Game Wizard 🧙🪄✨](/docs/wizard)
page for more info about the wizard.

:::tip
You will need to be authenticated against ShipThis before you can use the wizard.
To do that please run the following command first:

- [`shipthis login`](/docs/reference/login)

:::

This command runs the following other commands:

- [`shipthis game create`](/docs/reference/game/create)
- [`shipthis apple login`](/docs/reference/apple/login)
- [`shipthis apple apiKey create`](/docs/reference/apple/apiKey)
- [`shipthis apple certificate create`](/docs/reference/apple/certificate)
- [`shipthis game ios app create`](/docs/reference/game/ios/app)
- [`shipthis game ios app sync`](/docs/reference/game/ios/app)
- [`shipthis game ios profile create`](/docs/reference/game/ios/profile)


## Example

[![asciicast](https://asciinema.org/a/hOV55wY2oCeccoQXr0OgxWuhk.svg)](https://asciinema.org/a/hOV55wY2oCeccoQXr0OgxWuhk#shipthis-col120row32)

## Help Output

```
USAGE
  $ shipthis game wizard [-f <value>] [-p ios]

FLAGS
  -f, --forceStep=<value>  Force a specific step to run.
  -p, --platform=<option>  [default: ios] The platform to run the wizard for
                           <options: ios>

DESCRIPTION
  Runs all the steps for the specific platform

EXAMPLES
  $ shipthis game wizard
```