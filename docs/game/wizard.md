`shipthis game:wizard`
======================

Runs all the steps for the specific platform

* [`shipthis game wizard`](#shipthis-game-wizard)

## `shipthis game wizard`

Runs all the steps for the specific platform

```
USAGE
  $ shipthis game wizard -p ios [-f <value>]

FLAGS
  -f, --forceStep=<value>  Force a specific step to run. You can repeat this flag to force multiple steps.
  -p, --platform=<option>  (required) The platform to run the wizard for
                           <options: ios>

DESCRIPTION
  Runs all the steps for the specific platform

EXAMPLES
  $ shipthis game wizard
```

_See code: [src/commands/game/wizard.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/wizard.ts)_
