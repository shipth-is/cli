# game ios profile create

```
USAGE
  $ shipthis game ios profile create [-q] [-g &lt;value&gt;] [-f]

FLAGS
  -f, --force
  -g, --gameId=&lt;value&gt;  The ID of the game
  -q, --quiet           Avoid output except for interactions and errors

DESCRIPTION
  Creates a Mobile Provisioning Profile in the Apple Developer Portal. If --gameId is not provided it will look in the
  current directory.

EXAMPLES
  $ shipthis game ios profile create
```