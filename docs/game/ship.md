# Command: `game ship`

## Description

The `shipthis game ship` command builds your Godot game in the cloud and publishes it to the **App Store** and **Google Play**.

It uploads your project, compiles it on the ShipThis build servers using the credentials you set up with [`shipthis game wizard`](/docs/reference/game/wizard), and - unless you tell it not to - sends the finished build on to TestFlight or Google Play.

You do not need an Apple computer, Xcode or the Android SDK. If you are not ready to publish yet, `--skipPublish` gives you the build without sending it anywhere.

:::info What is a job?
Each platform you build for creates a **job** - one build of your game, on one platform, on our cloud build servers.

You can watch a job while it runs, or come back to it later with [`shipthis game job`](/docs/reference/game/job) or in the [ShipThis dashboard](https://shipth.is/dashboard).
:::

## Examples

### Standard use

When run without any flags, the command will try to run the full build and publish pipelines for each of the platforms that you have configured.

```bash
shipthis game ship
```

When run like this, pressing **L** will show or hide the last few lines of the logs, pressing **B** will open the job log in your browser.

[![asciicast](https://asciinema.org/a/7e1jPMx5i69VyM6TynkeFU0dI.svg)](https://asciinema.org/a/7e1jPMx5i69VyM6TynkeFU0dI#shipthis-col80row24)

### Follow mode

When using ShipThis in a CI environment, it is most useful to use the `--follow` to collect the full output. This flag requires you to specify the `--platform` flag too.

```bash
shipthis game ship --platform android --follow
```

[![asciicast](https://asciinema.org/a/gKmZ0E1rJ4oiT9SyuSivXBZfY.svg)](https://asciinema.org/a/gKmZ0E1rJ4oiT9SyuSivXBZfY#shipthis-col80row24)

### Follow, do not publish, and then download APK

Use `--skipPublish` when you want the build but do not want it sent to TestFlight or Google Play, and `--downloadAPK` to save the APK to a file when the job finishes. Together with `--follow` this builds your game, keeps the logs on screen, and leaves you with something you can install on a device:

```bash
shipthis game ship --platform android --follow --skipPublish --downloadAPK game.apk
```

Use `--download` instead of `--downloadAPK` to save the **AAB** for Google Play, or the **IPA** on iOS.

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

Before your build starts, your game files are zipped up and uploaded. Which files end up in that zip is controlled by the `globs` in your **shipthis.json** - see [Controlling uploaded files](/docs/guides/controlling-uploaded-files).

If the zip comes to **16MB or more**, ShipThis splits it up and sends the parts in parallel, which is a good deal faster than sending the whole thing in one go. Each part is sent on its own, so a dropped connection does not cost you the whole upload - the failed part is retried and the parts that already arrived stay where they are.

:::note
Zips under **16MB** are sent in a single request. Splitting a small zip into parts does not make it any faster.
:::

If the parallel upload gives you trouble, `--skipMultipart` will send the whole zip in one request instead. It is slower, and the zip must be under **5GB**:

```bash
shipthis game ship --platform android --skipMultipart
```

Add `--verbose` to watch the individual parts go up, including any that get retried.

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
