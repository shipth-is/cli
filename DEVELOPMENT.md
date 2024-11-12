# shipthis - Development Notes

## To build and run locally

```bash
npm run build
npm link
```

## When you add a command

When you add or remove a command you will need to update the `"exports"` section in the `package.json` file using:

```bash
find src/commands/ -type f | sed "s/src\([^\.]*\)\..*$/dist\1.js/g"
```

## To ensure you are using your local dev

```bash
source shipthis/bin/alias.sh
```

## Zero to iOS shipping steps

This is what the wizard now does:

```bash
shipthis login
shipthis game create
shipthis apple login
shipthis apple apiKey create
shipthis apple certificate create
shipthis game ios app create
shipthis game ios app sync
shipthis game ios profile create
shipthis game ship
```

## Releasing a new version

Done manually at the moment because we have 2FA on the npm account.

```bash
npm run build
npm version patch
npm publish
```
