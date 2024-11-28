# game ios profile export

Saves the current Mobile Provisioning Profile to a ZIP file

## Help Output
```
USAGE
  $ shipthis game ios profile export FILE [-g <value>] [-f]

ARGUMENTS
  FILE  Name of the ZIP file to create

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Saves the current Mobile Provisioning Profile to a ZIP file

EXAMPLES
  $ shipthis game ios profile export userProfile.zip
```