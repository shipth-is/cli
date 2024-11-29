# status

## Example

[![asciicast](https://asciinema.org/a/GsqLxzyvFApORKUDfJl5DsNo7.svg)](https://asciinema.org/a/GsqLxzyvFApORKUDfJl5DsNo7)

## Description

Displays the current overall status.

- **Logged in**
  - Will be "YES" once you are authenticated
  - Run `shipthis login` to authenticate
- **Godot project detected**
  - Will be "YES" if there is a file named project.godot in the current directory
- **ShipThis project configured**
  - Will be "YES" if there is a valid shipthis.json file in the current directory
- **Git repository detected (not required)**
  - Will be "YES" if ShipThis detects that there is an active git project
  - ShipThis will tag your uploads with the current git information (branch and commit hash)

## Help Output

```
USAGE
  $ shipthis status

DESCRIPTION
  Displays the current overall status.

EXAMPLES
  $ shipthis status
```