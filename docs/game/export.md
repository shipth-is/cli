# Command: `game export`

## Description

Downloads the shipthis.json file for a given game into the current directory.

If the `--current` flag is provided and there is a **shipthis.json** file in the current dir then the shipthis.json will be overwritten. This can be useful when upgrading the project config.

:::info
If you have custom globs then they will be lost when you use the `--current` flag.

You may want to copy and paste the original values into the new format. See the [Controlling Uploaded Files guide](https://shipth.is/docs/guides/controlling-uploaded-files) for more info.
:::

## Example

[![asciicast](https://asciinema.org/a/kAclG6bghhwuXWP4E5NUssAfA.svg)](https://asciinema.org/a/kAclG6bghhwuXWP4E5NUssAfA#shipthis-col100row32)

## Help Output

```help
USAGE
  $ shipthis game export [GAME_ID] [-f] [--current]

ARGUMENTS
  [GAME_ID]  The ID of the game to export (use "list" to get the ID)

FLAGS
  -f, --force
      --current  Use the project ID from the current shipthis.json config

DESCRIPTION
  Downloads the shipthis.json file for a given game into the current directory.

EXAMPLES
  $ shipthis game export abcd1234

  $ shipthis game export abcd1234 --force

  $ shipthis game export --current --force
```