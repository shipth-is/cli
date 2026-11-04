# Topic: `game encryption`

## Description

Commands related to the encryption key for a specific game

ShipThis can encrypt the PCK of your game. It makes a key for the game and handles the export templates, so you do not need to build your own.

## Turn on encryption

```bash
shipthis game details --useEncryption true
shipthis game encryption status
```

The key is made when you turn on encryption, and builds of the game are then encrypted. If you turn encryption off, the game keeps its key.

To change the setting for one build, see [`game ship`](/docs/reference/game/ship#building-with-encryption).

## Requirements

- **Godot 4.5 or newer**, on iOS and Android. With an older version, the build is refused when it starts.
- **A Gradle build on Android.** This is the default. An encrypted build fails if your export preset turns it off.
- **`encrypt_pck` off in your export preset, if encryption is off for the game.** With `encrypt_pck=true` and encryption off, the build fails. When encryption is on, ShipThis sets `encrypt_pck` for you.

## Use the key in your own exports

```bash
# Print the key
shipthis game encryption export

# Write the key to a file that only you can read
shipthis game encryption export key.txt
```

:::warning
Encryption stops casual extraction only. The key ships inside your game, so tools can pull it out.

On iOS, C# code is not in the PCK, so encryption does not cover it.
:::

## Commands


### `game encryption export`

#### Description

Prints the encryption key of a game, or writes it to a file, so you can use it in your own Godot exports.

#### Help Output

```help
USAGE
  $ shipthis game encryption export [FILE] [-g <value>] [-f]

ARGUMENTS
  [FILE]  Name of the file to write the key to. Prints the key if not given

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Prints the encryption key of a game, or writes it to a file, so you can use it in your own Godot exports.

EXAMPLES
  $ shipthis game encryption export

  $ shipthis game encryption export key.txt

  $ shipthis game encryption export key.txt --force

  $ shipthis game encryption export --gameId 0c179fc4
```

### `game encryption status`

#### Description

Shows if encryption is on for a game, and the fingerprint of its key.

#### Help Output

```help
USAGE
  $ shipthis game encryption status [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Shows if encryption is on for a game, and the fingerprint of its key.

EXAMPLES
  $ shipthis game encryption status

  $ shipthis game encryption status --gameId 0c179fc4
```
