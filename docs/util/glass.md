# Command: `util glass`

## Description

Applies a Liquid Glass `.icon` folder to a local Xcode project.

This updates the project's resources to include the specified `.icon` which Xcode will use as the app icon at build time.
Useful when preparing an iOS export created by Godot, when you want to apply a Liquid Glass icon locally before building.

:::note
Liquid Glass icons are bundles in the `.icon` format.
They look like a single file in Finder, but are actually directories containing all icon variants.
:::

This command works locally and does **not** require authentication.

## Arguments

- **`PROJECT`** - Path to the `.xcodeproj` directory you want to modify.
- **`ICON`** - Path to the `.icon` folder (e.g. `AppIcon.icon`).

## Example

Apply `MyIcon.icon` to an exported Xcode project:

```bash
shipthis util glass ios/output.xcodeproj MyIcon.icon
```

This will update the project configuration so that Xcode will use `MyIcon.icon` as the icon.

## Help Output

```help
USAGE
  $ shipthis util glass PROJECT ICON [--verbose]

ARGUMENTS
  PROJECT  Path to the .xcodeproj directory
  ICON     Path to the .icon folder

FLAGS
  --verbose  Enable verbose logging

DESCRIPTION
  Apply a Liquid Glass .icon folder to a local Xcode project
```