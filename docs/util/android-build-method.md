# Command: `util android-build-method`

## Description

Gets and sets the Android build method in export_presets.cfg

## Help Output

```help
USAGE
  $ shipthis util android-build-method [-l] [-g]

FLAGS
  -g, --gradle  use gradle build method
  -l, --legacy  use legacy build method

DESCRIPTION
  Gets and sets the Android build method in export_presets.cfg

EXAMPLES
  $ shipthis util android-build-method

  $ shipthis util android-build-method --legacy

  $ shipthis util android-build-method --gradle
```