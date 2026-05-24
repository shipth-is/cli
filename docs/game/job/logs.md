# Command: `game job logs`

## Description

Downloads the full plain-text logs for a job and writes them to stdout.

## Help Output

```help
USAGE
  $ shipthis game job logs JOB_ID [-g <value>]

ARGUMENTS
  JOB_ID  The id of the job to get the logs for

FLAGS
  -g, --gameId=<value>  The ID of the game

DESCRIPTION
  Downloads the full plain-text logs for a job and writes them to stdout.

EXAMPLES
  $ shipthis game job logs 4d32239e

  $ shipthis game job logs 4d32239e > job.log

  $ shipthis game job logs 4d32239e | grep -i error

  $ shipthis game job logs --gameId 0c179fc4 4d32239e | less
```