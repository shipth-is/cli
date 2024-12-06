# Command: `game ship`

## Description

Builds the app (for all platforms with valid credentials) and ships it to the stores.

After uploading the files to the ShipThis backend. it will run the [`shipthis game job status`](/docs/reference/game/job#game-job-status) command with the `--follow` flag so that you can watch the job output in **real-time**.

:::info
This command creates a new job. A **job** is a set of work done to create a new
build of your game.

To do this, it uploads the code in the current directory to the ShipThis backend.
To control which files are uploaded, in the **shipthis.json** file there are two [glob](https://en.wikipedia.org/wiki/Glob_(programming)) arrays **shippedFilesGlobs** and **ignoredFilesGlobs**.
:::


## Example

[![asciicast](https://asciinema.org/a/97iHQ7Vv1qcz0I3jntMmECqLJ.svg)](https://asciinema.org/a/97iHQ7Vv1qcz0I3jntMmECqLJ#shipthis-col160row32)

## Help Output

```
USAGE
  $ shipthis game ship [-g <value>]

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Builds the app (for all platforms with valid credentials) and ships it to the stores.

EXAMPLES
  $ shipthis game ship
```