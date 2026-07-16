# game ios app addTester

## Description

Adds a test user to the game in App Store Connect.

## Help Output

```help
USAGE
  $ shipthis game ios app addTester [-e <value>] [-f <value>] [-g <value>] [-l <value>] [-q] [-s] [-t <value>]

FLAGS
  -e, --email=<value>          The email address of the tester
  -f, --firstName=<value>      The first name of the tester
  -g, --gameId=<value>         The ID of the game
  -l, --lastName=<value>       The last name of the tester
  -q, --quiet                  Avoid output except for interactions and errors
  -s, --self                   Add yourself as a tester (uses your Apple ID email and name)
  -t, --testGroupName=<value>  [default: ShipThis Test Group (Internal)] The name of the internal test group

DESCRIPTION
  Adds a test user to the game in App Store Connect.

EXAMPLES
  $ shipthis game ios app addTester

  $ shipthis game ios app addTester --testGroupName "Testers"
```