#!/bin/bash

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $scriptDir/..

# We want to avoid overwriting the docs we have manually written
# To force override run `OVERWRITE=true ./bin/readme.sh`
OVERWRITE=${OVERWRITE:-false}

readme_command() {
  local file=$1
  local overwrite_option=""

  if [ "$OVERWRITE" = true ]; then
    overwrite_option="--overWrite"
  fi

  bin/dev.js internal readme docs/ -d 2 --only $file --notDryRun $overwrite_option
}

readme_command "docs/game"
readme_command "docs/apple/apiKey"
readme_command "docs/apple/certificate"
readme_command "docs/login.md"
readme_command "docs/status.md"
readme_command "docs/dashboard.md"
readme_command "docs/help.md"
