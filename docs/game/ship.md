# Command: `game ship`

## Description

The `shipthis game ship` command starts the process of building and publishing your game.

:::info
This command creates one or more "jobs". A **job** is a set of work done to create a new build of your game on one platform.

When this command is run, ShipThis uploads the code in the current directory to the ShipThis backend.
To control which files are uploaded, use `globs` in **shipthis.json**. Legacy keys `shippedFilesGlobs` and `ignoredFilesGlobs` are still supported for older projects. See `https://shipth.is/docs/guides/controlling-uploaded-files`.
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

Adding the `--useDemoCredentials` flag builds the specified platform with ShipThis demo certificates, keystores and provisioning profiles instead of your own. This is useful to generate an asset which can be side-loaded onto your own device.

The flag implies `--skipPublish`. A build signed with demo credentials is never published to TestFlight or Google Play.

```bash
# To build for iOS with demo credentials
shipthis game ship --platform ios --follow --useDemoCredentials --download game.ipa

# To build for Android with demo credentials
shipthis game ship --platform android --follow --useDemoCredentials --downloadAPK game.apk
```

### Uploading a large game

ShipThis makes a zip of your game. For a zip of 16MB or more, ShipThis sends the zip in
several parts at the same time. This is faster than one request.

Each part is separate. If the network fails, ShipThis sends that part again. The parts that
arrived stay on the server.

ShipThis sends a zip smaller than 16MB in one request. Parts do not make a small zip faster.

To send the zip in one request, use `--skipMultipart`. This method is slower, and the zip
must be smaller than 5GB. Use this flag only if the upload in parts fails.

```bash
shipthis game ship --platform android --skipMultipart
```

To see each part, and to see ShipThis send a part again, add `--verbose`.

### Overriding the Godot version

You can specify a different Godot version to use only for the current job. This can be helpful if you are upgrading your game to use a newer version of Godot.

```bash
shipthis game ship --platform android --follow --gameEngineVersion 4.5.1 --download game-4.5.1.aab
```

The CLI checks this version before it builds the zip, so a typo stops the command in a second.
See [Godot versioning](/docs/guides/godot-versioning) for the versions ShipThis supports.

## Help Output

```help
USAGE
  $ shipthis game ship [-g <value>] [--download <value> --platform android|ios] [--downloadAPK <value> ]
    [--follow ] [--skipMultipart] [--skipPublish] [--verbose] [--useDemoCredentials ]
    [--gameEngineVersion <value>] [--dryRun]

FLAGS
  -g, --gameId=<value>             The ID of the game
      --download=<value>           Download the build artifact to the specified file
      --downloadAPK=<value>        Download the APK artifact (if available) to the specified file
      --dryRun                     Dry run - lists the files that would be shipped without executing the build or
                                   publish steps
      --follow                     Follow the job logs in real-time (requires --platform)
      --gameEngineVersion=<value>  Override the specified game engine version for this build
      --platform=<option>          The platform to ship the game to. This can be "android" or "ios"
                                   <options: android|ios>
      --skipMultipart              Upload the zip in one request instead of several parts in parallel (slower, and
                                   limited to 5GB)
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

  $ shipthis game ship --platform android --dryRun
```
