# Command: `game ship`

## Description

The `shipthis game ship` command starts the process of building and publishing your game.

:::info
This command creates one or more "jobs". A **job** is a set of work done to create a new build of your game on one platform.

When this command is run, ShipThis uploads the code in the current directory to the ShipThis backend.
To control which files are uploaded, in the **shipthis.json** file there are two [glob](https://en.wikipedia.org/wiki/Glob_(programming)) arrays **shippedFilesGlobs** and **ignoredFilesGlobs**.
:::

## Examples

### Standard use

When run without any flags, the command will try to run the full build and publish pipelines for each of the platforms that you have configured.

When run like this, pressing **L** will show or hide the last few lines of the logs, pressing **B** will open the job log in your browser.

[![asciicast](https://asciinema.org/a/7e1jPMx5i69VyM6TynkeFU0dI.svg)](https://asciinema.org/a/7e1jPMx5i69VyM6TynkeFU0dI#shipthis-col80row24)

### Follow mode

When using ShipThis in a CI environment, it is most useful to use the `--follow` to collect the full output. This flag requires you to specify the `--platform` flag too.

[![asciicast](https://asciinema.org/a/gKmZ0E1rJ4oiT9SyuSivXBZfY.svg)](https://asciinema.org/a/gKmZ0E1rJ4oiT9SyuSivXBZfY#shipthis-col80row24)

### Advanced usage - follow, do not publish, and then download APK

[![asciicast](https://asciinema.org/a/GNf0t8niOlrMDsgPKqmBcuqQh.svg)](https://asciinema.org/a/GNf0t8niOlrMDsgPKqmBcuqQh#shipthis-col80row24)

## Help Output

```help
Builds the app (for all platforms with valid credentials) and ships it to the stores.

USAGE
  $ shipthis game ship [-g <value>] [--download <value> --platform android|ios] [--downloadAPK <value> ] [--follow ] [--skipPublish] [--verbose]

FLAGS
  -g, --gameId=<value>       The ID of the game
      --download=<value>     Download the build artifact to the specified file
      --downloadAPK=<value>  Download the APK artifact (if available) to the specified file
      --follow               Follow the job logs in real-time. Requires --platform to be specified.
      --platform=<option>    The platform to ship the game to. This can be "android" or "ios"
                             <options: android|ios>
      --skipPublish          Skip the publish step
      --verbose              Enable verbose logging

DESCRIPTION
  Builds the app (for all platforms with valid credentials) and ships it to the stores.

EXAMPLES
  $ shipthis game ship

  $ shipthis game ship --platform ios

  $ shipthis game ship --platform android --skipPublish

  $ shipthis game ship --platform android --download game.aab

  $ shipthis game ship --platform android --follow --downloadAPK game.apk

  $ shipthis game ship --platform ios --follow --verbose

```
