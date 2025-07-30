# Command: `apiKey create`

## Description

Create a new API key for your ShipThis account.

## Help Output

```help
USAGE
  $ shipthis apiKey create [-n <value>] [-d <value>] [-q]

FLAGS
  -d, --durationDays=<value>  [default: 30] duration of the API key in days
  -n, --name=<value>          name to apply to the API key (if not provided, a random name will be generated)
  -q, --quiet                 Outputs just the secret value

DESCRIPTION
  Create a new API key for your ShipThis account.

EXAMPLES
  $ shipthis apiKey create --durationDays 30

  $ shipthis apiKey create --name ci-key --durationDays 90

  $ shipthis apiKey create --name ci-key-headless --durationDays 365 --quiet
```