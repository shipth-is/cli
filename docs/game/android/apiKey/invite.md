# Command: `game android apiKey invite`

## Description

Invites the Service Account to your Google Play Account.

## Help Output

```
USAGE
  $ shipthis game android apiKey invite [ACCOUNTID] [-g <value>] [-p] [-p] [-w]

ARGUMENTS
  ACCOUNTID  The Google Play Account ID

FLAGS
  -g, --gameId=<value>    The ID of the game
  -p, --prompt            Prompt for the Google Play Account ID
  -p, --waitForGoogleApp  Waits for the Google Play app to be created (10 mins).
  -w, --waitForAuth       Wait for Google Authentication (10 mins).

DESCRIPTION
  Invites the Service Account to your Google Play Account.

EXAMPLES
  $ shipthis game android apiKey invite
```