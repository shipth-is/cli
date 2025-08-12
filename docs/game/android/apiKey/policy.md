# Command: `game android apiKey policy`

## Description

Gets and sets the iam.disableServiceAccountKeyCreation policy for your Google Organization

## Help Output

```help
USAGE
  $ shipthis game android apiKey policy [-g <value>] [-e | -r] [-w]

FLAGS
  -e, --enforce         Enforces the policy
  -g, --gameId=<value>  The ID of the game
  -r, --revoke          Revokes the policy
  -w, --waitForAuth     Wait for Google Authentication (10 mins).

DESCRIPTION
  Gets and sets the iam.disableServiceAccountKeyCreation policy for your Google Organization

EXAMPLES
  $ shipthis game android apiKey policy

  $ shipthis game android apiKey policy --enforce

  $ shipthis game android apiKey policy --revoke
```