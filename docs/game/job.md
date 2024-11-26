# game:job

Commands related to jobs for a specific game


## Commands

# game job list

```
USAGE
  $ shipthis game job list [-g &amp;lt;value&amp;gt;] [-p &amp;lt;value&amp;gt;] [-s &amp;lt;value&amp;gt;] [-o createdAt|updatedAt] [-r asc|desc]

FLAGS
  -g, --gameId=&amp;lt;value&amp;gt;      The ID of the game
  -o, --orderBy=&amp;lt;option&amp;gt;    [default: createdAt] The field to order by
                            &amp;lt;options: createdAt|updatedAt&amp;gt;
  -p, --pageNumber=&amp;lt;value&amp;gt;  The page number to show (starts at 0)
  -r, --order=&amp;lt;option&amp;gt;      [default: desc] The order to sort by
                            &amp;lt;options: asc|desc&amp;gt;
  -s, --pageSize=&amp;lt;value&amp;gt;    [default: 10] The number of items to show per page

DESCRIPTION
  Lists the jobs for a game. If --gameId is not provided it will look in the current directory.

EXAMPLES
  $ shipthis game job list

  $ shipthis game job list --gameId 0c179fc4
```

# game job status

```
USAGE
  $ shipthis game job status JOB_ID [-g &amp;lt;value&amp;gt;] [-n &amp;lt;value&amp;gt;] [-f]

ARGUMENTS
  JOB_ID  The id of the job to get the status of

FLAGS
  -f, --follow          Follow the log in real-time
  -g, --gameId=&amp;lt;value&amp;gt;  The ID of the game
  -n, --lines=&amp;lt;value&amp;gt;   [default: 10] The number of lines to show

DESCRIPTION
  Shows the real-time status of a job.

EXAMPLES
  $ shipthis game job status 4d32239e

  $ shipthis game job status --gameId 0c179fc4 4d32239e

  $ shipthis game job status --gameId 0c179fc4 --lines 20 --follow 4d32239e
```
