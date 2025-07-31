<h1 align="center">
  <a href="https://shipth.is">
    <picture>
      <source height="56" width="260" srcset="docs/assets/logo_dark.svg" media="(prefers-color-scheme: dark)">
      <img height="56" width="260" alt="ShipThis Home" src="docs/assets/logo_light.svg">
    </picture>
  </a>
  <br>
  <a href="https://discord.gg/gPjn3S99k4">
    <img alt="discord" src="https://img.shields.io/discord/1304144717239554069?style=flat-square&label=%F0%9F%92%AC%20discord&color=00ACD7">
  </a>
</h1>
<p align="center">
  <b>ShipThis</b> is a <b>command line tool</b> for building and uploading your <a href="https://godotengine.org/">Godot</a> mobile games to the <b>Apple App Store</b> and <b>Google Play</b>.
</p>
<p align="center">
  ShipThis compiles your game on managed cloud servers. You do not need Xcode, Android Studio, or SDK installations. You can run it manually or from CI.
</p>

<p align="center">
  <picture>
    <img height="266" width="504" alt="ShipThis Command - ship output" src="docs/assets/ship-outputx0.8.gif">
  </picture>
</p>


> [!IMPORTANT]
> ShipThis is in open beta. While in beta, it is completely free to use.

---

## Why use ShipThis?

- **Always a free tier** - Enough build minutes for most solo devs
- **One-command setup** - Use the interactive [`wizard`](https://shipth.is/docs/reference/game/wizard) to configure your game
- **No additional tools** - No Xcode, Android Studio, or SDK installation required
- **Simplified provisioning** - We handle iOS certificates, Android keystores, app signing, and API keys
- **One-command deployment** - Publish to TestFlight or Google Play with a single command

## Quick start

### Requirements

- A Godot 3.6 or 4.X game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above
- **To publish an Android game** - a [Play Console developer account](https://play.google.com/apps/publish/signup) (not required for building an APK/AAB)
- **To build an iOS game** - an [Apple Developer account](https://developer.apple.com)

### 1. Install ShipThis

ShipThis can be installed as a package via the [NPM package manager](https://www.npmjs.com/). Run the following at the command line:

```bash
npm install -g shipthis
```

### 2. Create an account

Set up an account with ShipThis by logging in for the first time using the [`shipthis login`](https://shipth.is/docs/reference/login) command.

> 🛠 All builds run on managed cloud servers - no need to install Xcode or Android Studio locally.

```bash
shipthis login
```

### 3. Set up your game

Run the [wizard command](https://shipth.is/docs/reference/game/wizard) to configure your game on ShipThis. The command takes a platform parameter - this can be either **android** or **ios**. Run this command from within a Godot game directory (with a **project.godot** file):

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

Now you can publish new versions of your game to TestFlight or Google Play with the [`shipthis game ship`](https://shipth.is/docs/reference/game/ship) command:

```bash
shipthis game ship
```

- Having issues? Check the [Troubleshooting](https://shipth.is/docs/troubleshooting) or [join our Discord](https://discord.gg/gPjn3S99k4)
- For detailed documentation, visit [shipth.is/docs](https://shipth.is/docs)


## FAQ

<details>
<summary><strong>Can I build my game as APK without a Google Play account?</strong></summary>

---

Yes.

Running the wizard command will create a Service Account Key for automatic publishing, you might not need this when initially building your game.

You can run the steps below to create a ShipThis account, create the game, create a keystore, and then run the ship command. Later, when you need to setup publishing you can re-run the wizard command.


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


</details>


<details>
<summary><strong>Do I need a Mac to build for iOS?</strong></summary>

---

No, you do not need a Mac, but you will need an Apple Developer Account.

ShipThis handles iOS builds on managed macOS cloud servers. The command-line tool communicates with the Apple Developer Portal to configure everything on your behalf.

</details>

<details>
<summary><strong>Which versions of Godot are supported?</strong></summary>

---

We support **all stable Godot versions since 3.6**, including:

| 3.6     | 4.0      | 4.1      | 4.2    | 4.3 | 4.4    |
|---------|----------|----------|--------|-----|--------|
| 3.6.1   | 4.0.1    | 4.1.1    | 4.2.1  |     | 4.4.1  |
|         | 4.0.2    | 4.1.2    | 4.2.2  |     |        |
|         | 4.0.3    | 4.1.3    |        |     |        |
|         | 4.0.4    | 4.1.4    |        |     |        |

You can read more in our [Godot versioning guide](https://shipth.is/docs/guides/godot-versioning).

</details>

<details>
<summary><strong>Do I need to create an export_presets.cfg file?</strong></summary>

---

No, the ShipThis build server will generate a valid **export_presets.cfg** for your game.

If you provide an **export_presets.cfg** file, the desired preset values will be merged with the generated file.

</details>

<details>
<summary><strong>How much does it cost to use ShipThis?</strong></summary>

---

ShipThis is currently in open-beta as so it is completely free to use. You can see our planned pricing on the [pricing page](https://shipth.is/pricing).

</details>

## 📖 Command Reference

### 🗂 Topics

- [apiKey](https://shipth.is/docs/reference/apiKey) - Commands related to ShipThis API Keys
- [apple](https://shipth.is/docs/reference/apple) - Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipth.is/docs/reference/game) - Commands that relate to configuring the specific game in the current working directory.

### 🔧 Commands

- [dashboard](https://shipth.is/docs/reference/dashboard) - Opens the web browser to your shipth.is dashboard
- [login](https://shipth.is/docs/reference/login) - Sign in or create a new account
- [status](https://shipth.is/docs/reference/status) - Display your overall ShipThis account status
- [help](https://shipth.is/docs/reference/help) - Display help for a specific topic or command

## 🌍 Community

- 💬 [Join us on Discord](https://discord.gg/gPjn3S99k4)
- 🐛 [Report an issue](https://github.com/shipth-is/cli/issues)
- 📣 Feature ideas? Feedback? We’d love to hear from you - email support@shipth.is