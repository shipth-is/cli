# game job status

```
USAGE
  $ shipthis game job status JOB_ID [-g &lt;value&gt;] [-n &lt;value&gt;] [-f]

ARGUMENTS
  JOB_ID  The id of the job to get the status of

FLAGS
  -f, --follow          Follow the log in real-time
  -g, --gameId=&lt;value&gt;  The ID of the game
  -n, --lines=&lt;value&gt;   [default: 10] The number of lines to show

DESCRIPTION
  Shows the real-time status of a job.

EXAMPLES
  $ shipthis game job status 4d32239e

  $ shipthis game job status --gameId 0c179fc4 4d32239e

  $ shipthis game job status --gameId 0c179fc4 --lines 20 --follow 4d32239e
```