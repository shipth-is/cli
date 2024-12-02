# ShipThis CLI

## Introduction

ShipThis is a tool which helps you manage releasing your [Godot](https://godotengine.org/) games to the iOS App Store.

:::tip Info
You don't need an Apple computer to use ShipThis.
:::

## Quickstart

Let's discover **ShipThis in less than 5 minutes**.

### What you'll need

- A Godot game
- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
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

Set up your ShipThis configuration using the built in [wizard](https://shipthis.cc/docs/wizard):

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


## Topics

- [apple](https://shipthis.cc/docs/reference/apple) - Commands that relate to linking your ShipThis account with your Apple Developer Account
- [game](https://shipthis.cc/docs/reference/game) - Commands that relate to configuring the specific game in the current working directory.

## Commands

- [dashboard](https://shipthis.cc/docs/reference/dashboard) - Opens the web browser to your shipthis.cc dashboard
- [login](https://shipthis.cc/docs/reference/login) - Signin or create a new account
- [status](https://shipthis.cc/docs/reference/status) - Display your overall ShipThis account status
- [help](https://shipthis.cc/docs/reference/help) - Display help for a specific topic or command
