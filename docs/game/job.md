`shipthis game:job`
===================

Commands related to jobs for a specific game

* [`shipthis game job list`](#shipthis-game-job-list)
* [`shipthis game job status JOB_ID`](#shipthis-game-job-status-job_id)

## `shipthis game job list`

Lists the jobs for a game. If --gameId is not provided it will look in the current directory.

```
USAGE
  $ shipthis game job list [-g <value>] [-p <value>] [-s <value>] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=<value>      The ID of the game
  -o, --orderBy=<option>    [default: createdAt] The field to order by
                            <options: createdAt|updatedAt>
  -p, --pageNumber=<value>  The page number to show (starts at 0)
  -r, --order=<option>      [default: desc] The order to sort by
                            <options: asc|desc>
  -s, --pageSize=<value>    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the jobs for a game. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game job list

  $ shipthis game job list --gameId 0c179fc4
```

_See code: [src/commands/game/job/list.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/job/list.ts)_

## `shipthis game job status JOB_ID`

Shows the real-time status of a job.

```
USAGE
  $ shipthis game job status JOB_ID [-g <value>] [-n <value>] [-f]

ARGUMENTS
  JOB_ID  The id of the job to get the status of

FLAGS
  -f, --follow          Follow the log in real-time
  -g, --gameId=<value>  The ID of the game
  -n, --lines=<value>   [default: 10] The number of lines to show

DESCRIPTION
  Shows the real-time status of a job.

EXAMPLES
  $ shipthis game job status 4d32239e

  $ shipthis game job status --gameId 0c179fc4 4d32239e

  $ shipthis game job status --gameId 0c179fc4 --lines 20 --follow 4d32239e
```

_See code: [src/commands/game/job/status.ts](https://gitlab.com/shipthis.cc/shipthis-cli/blob/v0.0.8/src/commands/game/job/status.ts)_
