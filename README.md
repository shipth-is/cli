# ShipThis <a href="https://discord.gg/gPjn3S99k4"><img alt="discord" src="https://img.shields.io/discord/1304144717239554069?style=flat-square&label=%F0%9F%92%AC%20discord&color=00ACD7"></a><a href="https://shipth.is/?ref=github_readme"><img src="docs/assets/st.png" align="right" height="80" alt="ShipThis" /></a>

- Build and publish Godot mobile games to the **App Store** and **Google Play**
- Handles certificates, keystores, API keys, and provisioning profiles
- Cloud builds are free for most solo-devs

<p align="center">
  <a href="https://shipth.is/docs/reference/game/ship?ref=github_readme">
    <picture>
      <img height="266" width="504" alt="ShipThis Command - ship output" src="docs/assets/ship-outputx0.8.gif">
    </picture>
  </a>
</p>

> [!IMPORTANT]
> Currently in open beta and free to use. It will **always** be free for most solo devs.

## Quick start

### Requirements

- A Godot 3.6 or 4.x game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above
- **To publish an Android game** - a [Play Console developer account](https://play.google.com/apps/publish/signup) (not required for building an APK/AAB)
- **To build an iOS game** - an [Apple Developer account](https://developer.apple.com)

### 1. Install ShipThis


Install via the [NPM package manager](https://www.npmjs.com/):

```bash
npm install -g shipthis
```

### 2. Create an account

Set up an account with ShipThis by logging in for the first time using the [`shipthis login`](https://shipth.is/docs/reference/login?ref=github_readme) command.


```bash
shipthis login
```

### 3. Set up your game

Run the [wizard command](https://shipth.is/docs/reference/game/wizard?ref=github_readme) to configure your game on ShipThis. The command takes a platform parameter - this can be either **android** or **ios**. Run this command from within a Godot game directory (with a **project.godot** file):

#### Set up an Android game

```bash
shipthis game wizard android
```

<details>
<summary><strong>Watch: Set up ShipThis for Android</strong></summary>

<p align="center">
  <picture>
    <img height="431" width="672" alt="ShipThis Command - Android Wizard - published game" src="docs/assets/wizard-android-existingx0.5.gif">
  </picture>
</p>

</details>

#### Set up an iOS game

```bash
shipthis game wizard ios
```

<details>
<summary><strong>Watch: Set up ShipThis for iOS</strong></summary>

<p align="center">
  <a href="https://www.youtube.com/watch?v=ijTUFVk1duw" target="_blank">
    <img src="https://img.youtube.com/vi/ijTUFVk1duw/0.jpg" alt="Watch the iOS setup video" width="640" height="480">
  </a>
</p>

</details>

### 4. Ship

Now you can publish new versions of your game to TestFlight or Google Play with the [`shipthis game ship`](https://shipth.is/docs/reference/game/ship?ref=github_readme) command:

```bash
shipthis game ship
```

- Having issues? Check the [Troubleshooting](https://shipth.is/docs/troubleshooting?ref=github_readme) or [join our Discord](https://discord.gg/gPjn3S99k4)
- For detailed documentation, visit [shipth.is/docs](https://shipth.is/docs?ref=github_readme)


## FAQ

### Do I need a Mac to build for iOS?

No, you do not need a Mac, but you will need an Apple Developer Account.

ShipThis handles iOS builds on managed macOS cloud servers. The CLI connects to the Apple Developer Portal and sets everything up for you.

### Which versions of Godot are supported?

We support **all stable Godot versions since 3.6**, including:

| 3.6     | 4.0      | 4.1      | 4.2    | 4.3 | 4.4    |
|---------|----------|----------|--------|-----|--------|
| 3.6.1   | 4.0.1    | 4.1.1    | 4.2.1  |     | 4.4.1  |
|         | 4.0.2    | 4.1.2    | 4.2.2  |     |        |
|         | 4.0.3    | 4.1.3    |        |     |        |
|         | 4.0.4    | 4.1.4    |        |     |        |

You can read more in our [Godot versioning guide](https://shipth.is/docs/guides/godot-versioning?ref=github_readme).


### Can I build my game as APK without a Google Play account?

Yes.

Running the wizard command will create a Service Account Key for automatic publishing, but you might not need this when initially building your game.

You can create a ShipThis account, create the game, create a keystore, and then run the ship command. Later, when you need to set up publishing, you can re-run the wizard command.

```bash
# Create or login to your shipthis account (OTP based login)
shipthis login --email me@email.com

# Create a ShipThis game - run this in a dir with a project.godot file
shipthis game create --name "My Game" --androidPackageName "com.my.game"

# Create a keystore for signing the APK
shipthis game android keyStore create

# Run the build, skip the publish step, and download as game.apk
shipthis game ship --follow --platform android --skipPublish --downloadAPK game.apk
```

### Do I need to create an export_presets.cfg file?

No, the ShipThis build server will generate a valid **export_presets.cfg** for your game.

If you provide an **export_presets.cfg** file, the desired preset values will be merged with the generated file.

### How much does it cost to use ShipThis?

Currently free while in open beta. Planned pricing is on the [pricing page](https://shipth.is/pricing?ref=github_readme).

### What does the `shipthis game wizard android` command do?

The Android wizard command runs through a set of steps, as described in the [Android set-up guide](https://shipth.is/docs/android?ref=github_readme).

<details>
<summary><strong>Watch: Set up ShipThis for Android</strong></summary>

<p align="center">
  <picture>
    <img height="431" width="672" alt="ShipThis Command - Android Wizard - published game" src="docs/assets/wizard-android-existingx0.5.gif">
  </picture>
</p>

</details>

<details>
<summary><strong>The Android wizard steps</strong></summary>

1. Creating a new ShipThis game

    ```bash
    shipthis game create --name "Pay2Lose" --androidPackageName "com.pay.two.lose"
    ```

1. Creating or importing an Android Keystore

    To create a new Keystore:

    ```bash
    shipthis game android keyStore create
    ```

    To import an existing Keystore see [the docs for the `shipthis game android keyStore import` command](https://shipth.is/docs/reference/game/android/keyStore?ref=github_readme#game-android-keystore-import)

1. Connecting ShipThis with Google

    Once connected, ShipThis can generate a Service Account API Key for automatic publishing.

    ```bash
    shipthis game android apiKey connect
    ```

1. Create a Service Account and API Key

    ```bash
    shipthis game android apiKey create
    ```

1. Create and download an initial build (AAB file)

    When you first create your game in the Google Play Console, you will be asked to upload an initial build in AAB format.

    ```bash
    shipthis game ship --platform android --follow --skipPublish --download game.aab
    ```

1. Create an app in the Google Play Console

    You will need to manually create the game itself in Google Play. This will involve entering the name, agreeing to Google Play's TOS and uploading an initial build.

1. Invite the Service Account

    Before the Service Account API Key can submit your games automatically, you will need to invite the Service Account to your Google Play account. To do this you will need your Google Play Account ID.

    ```bash
    shipthis game android apiKey invite XXXXXXXXX
    ```

</details>

### What does the `shipthis game wizard ios` command do?

The iOS wizard walks you through the steps from the [iOS setup guide](https://shipth.is/docs/ios).

<details>
<summary><strong>Watch: Set up ShipThis for iOS</strong></summary>

<p align="center">
  <a href="https://www.youtube.com/watch?v=ijTUFVk1duw" target="_blank">
    <img src="https://img.youtube.com/vi/ijTUFVk1duw/0.jpg" alt="Watch the iOS setup video" width="640" height="480">
  </a>
</p>

</details>

<details>
<summary><strong>The iOS wizard steps</strong></summary>

1. Create a new ShipThis game

    ```bash
    shipthis game create --name "Tap to Win Nothing" --iosBundleId "com.tap.to.win.nothing"
    ```

1. Connect ShipThis with Apple

    We recommend enabling 2FA for your account. ShipThis generates a session cookie for communicating with the Apple Developer Portal.

    ```bash
    shipthis apple login
    ```

1. Create an App Store Connect API Key

    ShipThis uses this API key to submit new versions of your game.

    ```bash
    shipthis apple apiKey create
    ```

1. Create an iOS Distribution Certificate

    This certificate is used to sign your game on the ShipThis build servers.

    ```bash
    shipthis apple certificate create
    ```

1. Create an App Store App and BundleId

    ```bash
    shipthis game ios app create
    ```

1. Synchronize Permissions (Capabilities)

    ShipThis reads `export_presets.cfg` and enables supported capabilities in the Apple Developer Portal (currently Access WiFi, Push Notifications).

    ```bash
    shipthis game ios app sync
    ```

1. Create a Provisioning Profile

    Required to run on devices and for distribution. You can view profiles at Apple’s portal: https://developer.apple.com/account/resources/profiles/list

    ```bash
    shipthis game ios profile create
    ```

</details>

## 📖 Command Reference

### 🗂 Topics

- [apiKey](https://shipth.is/docs/reference/apiKey?ref=github_readme) - Commands related to ShipThis API Keys
- [apple](https://shipth.is/docs/reference/apple?ref=github_readme) - Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipth.is/docs/reference/game?ref=github_readme) - Commands that relate to configuring the specific game in the current working directory.

### 🔧 Commands

- [dashboard](https://shipth.is/docs/reference/dashboard?ref=github_readme) - Opens the web browser to your shipth.is dashboard
- [login](https://shipth.is/docs/reference/login?ref=github_readme) - Sign in or create a new account
- [status](https://shipth.is/docs/reference/status?ref=github_readme) - Display your overall ShipThis account status
- [help](https://shipth.is/docs/reference/help?ref=github_readme) - Display help for a specific topic or command

## 🌍 Community

- 💬 [Join us on Discord](https://discord.gg/gPjn3S99k4)
- 🐛 [Report an issue](https://github.com/shipth-is/cli/issues)
- 📣 Feature ideas? Feedback? We’d love to hear from you - email support@shipth.is