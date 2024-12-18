# shipthis - Development Notes

## To build and run locally

```bash
npm run build
npm link
```

## To use your own backend

```bash
export SHIPTHIS_DOMAIN=my-custom-domain.com
shipthis login
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

## Releasing a new version

Done manually at the moment because we have 2FA on the npm account.

```bash
npm run build
npm version patch
npm publish
```
