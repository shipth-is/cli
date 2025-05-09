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
  ShipThis compiles your game on managed cloud servers — no local build tools needed. Use it manually or add it into your CI when you're ready to ship.
</p>

<p align="center">
  <picture>
    <img height="266" width="504" alt="ShipThis Command - ship output" src="docs/assets/ship-outputx0.8.gif">
  </picture>
</p>


> [!IMPORTANT]
> ShipThis is in open beta. While in beta, it is completely free to use.

---


<details>
<summary><strong>Watch: Set up ShipThis for iOS</strong></summary>

<center>

[![Watch the iOS setup](https://img.youtube.com/vi/ijTUFVk1duw/0.jpg)](https://www.youtube.com/watch?v=ijTUFVk1duw)

</center>

</details>
<details>
<summary><strong>Watch: Set up ShipThis for Android</strong></summary>

<p align="center">
  <picture>
    <img height="431" width="672" alt="ShipThis Command - Android Wizard - published game" src="docs/assets/wizard-android-existingx0.5.gif">
  </picture>
</p>

</details>


## ❓ Why use ShipThis?

- **✅ Always a free tier** – Enough usage for most solo devs.
- **✨ One-command setup** – Our interactive [`wizard`](https://shipth.is/docs/reference/game/wizard) guides you through configuration.
- **⏩ Skip the build tools** – No Xcode, Android Studio, or SDK installation required.
- **🔐 Simplify provisioning** – We handle iOS certificates, Android keystores, app signing, and API keys.
- **🚀 One-command deployment** – Publish to TestFlight or Google Play with a single CLI command.

## ⚡️ Quick start

### What you'll need

- A Godot 3.6 or 4.X game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above
- **If you are building an iOS game** – an [Apple Developer account](https://developer.apple.com)
- **If you are building an Android game** – a [Play Console developer account](https://play.google.com/apps/publish/signup)

### 1. Install ShipThis

ShipThis can be installed as a package via the [NPM package manager](https://www.npmjs.com/). Run the following at the command line:

```bash
npm install -g shipthis
```

### 2. Create an account

Set up an account with ShipThis by logging in for the first time using the [`shipthis login`](https://shipth.is/docs/reference/login) command.

> 🛠 All builds run on managed cloud servers – no need to install Xcode or Android Studio locally.

```bash
shipthis login
```

### 3. Set up your game

Next, run the [wizard command](https://shipth.is/docs/reference/game/wizard) to configure your game on ShipThis. The command takes a platform parameter – this can be either **android** or **ios**. Run this command from within a Godot game directory (with a **project.godot** file):

### Set up an Android game

```bash
shipthis game wizard android
```

### Set up an iOS game

```bash
shipthis game wizard ios
```

### 4. Ship

Now you can publish new versions of your game to TestFlight or Google Play with the [`shipthis game ship`](https://shipth.is/docs/reference/game/ship) command:

```bash
shipthis game ship
```

- 💡 Having issues? Check the [Troubleshooting](https://shipth.is/docs/troubleshooting) or [join our Discord](https://discord.gg/gPjn3S99k4)
- 📚 For detailed documentation, visit [shipth.is/docs](https://shipth.is/docs)

## 📖 Command Reference

### 🗂 Topics

- [apple](https://shipth.is/docs/reference/apple) – Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipth.is/docs/reference/game) – Commands that relate to configuring the specific game in the current working directory.

### 🔧 Commands

- [dashboard](https://shipth.is/docs/reference/dashboard) – Opens the web browser to your shipth.is dashboard
- [login](https://shipth.is/docs/reference/login) – Sign in or create a new account
- [status](https://shipth.is/docs/reference/status) – Display your overall ShipThis account status
- [help](https://shipth.is/docs/reference/help) – Display help for a specific topic or command

## 🌍 Community

- 💬 [Join us on Discord](https://discord.gg/gPjn3S99k4)
- 🐛 [Report an issue](https://github.com/shipth-is/cli/issues)
- 📣 Feature ideas? Feedback? We’d love to hear from you – email support@shipth.is
