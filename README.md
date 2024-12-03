<h1 align="center">
  <a href="https://shipthis.cc">
    <picture>
    <source height="56" width="260" srcset="https://shipthis.cc/logo_darkmode.svg">
      <img height="56" width="260" alt="ShipThis" src="https://shipthis.cc/logo_darkmode.svg" ></img>
    </picture>
  </a>
  <br>
  <a href="https://discord.gg/rHhguPjZ">
    <img src="https://img.shields.io/discord/1304144717239554069?style=flat-square&label=%F0%9F%92%AC%20discord&color=00ACD7">
  </a>
</h1>
<p align="center">
  <em><b>ShipThis</b> is a <b>command line tool</b> which manages releasing your <a href="https://godotengine.org/">Godot</a> games to the <b>iOS App Store</b>. Designed to compile and upload your Godot games in the cloud, meaning <b>you do not need to install or run Xcode to release an iOS game</b>.</em>
</p>

---

## ⚡️ Quickstart

### You will need

- A Godot 3.6 or 4.3 game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above
- An [Apple Developer](https://developer.apple.com) account

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

### 3. Configure your game

Set up your ShipThis configuration using the built in [wizard](https://shipthis.cc/docs/wizard). Run this command from within a Godot game directory (with a project.godot file):

```bash
shipthis game wizard
```

### 4. Ship

Now you can publish your game to TestFlight with the [`shipthis game ship`](https://shipthis.cc/docs/reference/game/ship) command:

```bash
shipthis game ship
```

Once you are happy with the build you can submit it to Apple using [App Store
Connect](https://appstoreconnect.apple.com/).

Re-run the `shipthis game ship` command each time you want to build a new release of your game. **You never need to run Xcode**.

### Next Steps

- Checkout the [ShipThis Tutorial](https://shipthis.cc/docs/tutorial)

## 📖 Command Reference

### Topics

- [apple](https://shipthis.cc/docs/reference/apple) - Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipthis.cc/docs/reference/game) - Commands that relate to configuring the specific game in the current working directory.

### Commands

- [dashboard](https://shipthis.cc/docs/reference/dashboard) - Opens the web browser to your shipthis.cc dashboard
- [login](https://shipthis.cc/docs/reference/login) - Signin or create a new account
- [status](https://shipthis.cc/docs/reference/status) - Display your overall ShipThis account status
- [help](https://shipthis.cc/docs/reference/help) - Display help for a specific topic or command
