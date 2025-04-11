<h1 align="center">
  <a href="https://shipthis.cc">
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
  <em><b>ShipThis</b> is a <b>command line tool</b> which manages building and uploading your <a href="https://godotengine.org/">Godot</a> mobile games to the <b>Apple App Store</b> and <b>Google Play</b>.</em>
</p>
<p align="center">
  <em><b>ShipThis compiles and uploads your Godot games in the cloud, meaning</b> you do not need to install or run Xcode or Android Studio to ship a Godot iOS/Android game.</em>
</p>


<p align="center">
  <picture>
    <img height="266" width="504" alt="ShipThis Home" src="docs/assets/ship-outputx0.8.gif">
  </picture>
</p>

---

## ⚡️ Quick start

### What you'll need

- A Godot 3.6 or 4.X game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above
- **If you are building an iOS game** - an [Apple Developer account](https://developer.apple.com)
- **If you are building an Android game** - a [Play Console developer account](https://play.google.com/apps/publish/signup)

### 1. Install ShipThis

ShipThis can be installed as a package via the [NPM package manager](https://www.npmjs.com/). Run the following at the command line:

```bash
npm install -g shipthis
```

### 2. Create an account

Set up an account with ShipThis by logging in for the first time using the [`shipthis login`](https://shipthis.cc/docs/reference/login) command.

```bash
shipthis login
```

### 3. Set up your game

Next, run the [wizard command](https://shipthis.cc/docs/reference/game/wizard) to configure your game on ShipThis. The command takes a platform parameter - this can be either **android** or **ios**. Run this command from within a Godot game directory (with a **project.godot** file):

### Set up an Android game

```bash
shipthis game wizard android
```

### Set up an iOS game

```bash
shipthis game wizard ios
```

### 4. Ship

Now you can publish new versions your game to TestFlight or Google Play with the [`shipthis game ship`](https://shipthis.cc/docs/reference/game/ship) command:

```bash
shipthis game ship
```

## 📖 Command Reference

### Topics

- [apple](https://shipthis.cc/docs/reference/apple) - Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipthis.cc/docs/reference/game) - Commands that relate to configuring the specific game in the current working directory.

### Commands

- [dashboard](https://shipthis.cc/docs/reference/dashboard) - Opens the web browser to your shipthis.cc dashboard
- [login](https://shipthis.cc/docs/reference/login) - Signin or create a new account
- [status](https://shipthis.cc/docs/reference/status) - Display your overall ShipThis account status
- [help](https://shipthis.cc/docs/reference/help) - Display help for a specific topic or command
