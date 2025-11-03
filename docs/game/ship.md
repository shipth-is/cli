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

### Follow, do not publish, and then download APK

[![asciicast](https://asciinema.org/a/GNf0t8niOlrMDsgPKqmBcuqQh.svg)](https://asciinema.org/a/GNf0t8niOlrMDsgPKqmBcuqQh#shipthis-col80row24)

### Building with demo credentials

Adding the `--useDemoCredentials` flag executes the build for the specified platform but applies ShipThis certificates, keystores or provisioning profiles. This can be useful to generate an asset which can be side-loaded onto your own device.

```bash
# To build for iOS with demo credentials
shipthis game ship --platform ios --follow --useDemoCredentials --download game.ipa

# To build for Android with demo credentials
shipthis game ship --platform android --follow --useDemoCredentials --downloadAPK game.apk
```

### Overriding the Godot version

You can specify a different Godot version to use only for the current job. This can be helpful if you are upgrading your game to use a newer version of Godot.

```bash
shipthis game ship --platform android --follow --gameEngineVersion 4.5.1 --download game-4.5.1.aab
```

## Help Output

```help
USAGE
  $ shipthis game ship [-g <value>] [--download <value> --platform android|ios] [--downloadAPK <value> ] [--follow ] [--skipPublish] [--verbose] [--useDemoCredentials ]
    [--gameEngineVersion <value>]

FLAGS
  -g, --gameId=<value>             The ID of the game
      --download=<value>           Download the build artifact to the specified file
      --downloadAPK=<value>        Download the APK artifact (if available) to the specified file
      --follow                     Follow the job logs in real-time (requires --platform)
      --gameEngineVersion=<value>  Override the specified game engine version for this build
      --platform=<option>          The platform to ship the game to. This can be "android" or "ios"
                                   <options: android|ios>
      --skipPublish                Skip the publish step
      --useDemoCredentials         Use demo credentials for this build (requires --platform, implies --skipPublish)
      --verbose                    Enable verbose logging

DESCRIPTION
  Builds and publishes your ShipThis game.

EXAMPLES
  $ shipthis game ship

  $ shipthis game ship --platform ios

  $ shipthis game ship --platform android --skipPublish

  $ shipthis game ship --platform android --download game.aab

  $ shipthis game ship --platform android --follow --downloadAPK game.apk

  $ shipthis game ship --platform ios --follow --verbose

  $ shipthis game ship --platform ios --useDemoCredentials --download game.ipa

  $ shipthis game ship --platform android --gameEngineVersion 4.5.1 --skipPublish
```
