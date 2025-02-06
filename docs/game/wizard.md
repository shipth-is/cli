# Command: `game wizard`

## Description

Runs all the steps for the specific platform.

To see the iOS steps run by the wizard, please refer to the [Set up iOS](/docs/ios) page.
To see the Android steps run by the wizard, please refer to the [Set up Android](/docs/android) page.

:::tip
You will need to be authenticated against ShipThis before you can use the wizard.
To do that please run the following command first:

- [`shipthis login`](/docs/reference/login)

:::

## Example

[![asciicast](https://asciinema.org/a/hOV55wY2oCeccoQXr0OgxWuhk.svg)](https://asciinema.org/a/hOV55wY2oCeccoQXr0OgxWuhk#shipthis-col120row32)

## Help Output

```
USAGE
  $ shipthis game wizard PLATFORM [-f <value>]

ARGUMENTS
  PLATFORM  The platform to run the wizard for

FLAGS
  -f, --forceStep=<value>  Force a specific step to run.

DESCRIPTION
  Runs all the steps for the specific platform

EXAMPLES
  $ shipthis game wizard ios

  $ shipthis game wizard android
```
