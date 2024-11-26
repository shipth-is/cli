# game build download

```
USAGE
  $ shipthis game build download BUILD_ID FILE [-g &lt;value&gt;] [-f]

ARGUMENTS
  BUILD_ID  The ID of the build to download
  FILE      Name of the file to output

FLAGS
  -f, --force           Overwrite the file if it already exists
  -g, --gameId=&lt;value&gt;  The ID of the game

DESCRIPTION
  Downloads the given build artifact to the specified file

EXAMPLES
  $ shipthis game build download 7a3f5c92 output.ipa

  $ shipthis game build download --gameId 0c179fc4 e4b9a3d7 output.apk
```