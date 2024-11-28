#!/bin/bash

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $scriptDir/..

# We want to avoid overwriting the docs we have manually written

bin/dev.js internal readme docs/ -d 2 --only docs/game --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/apple/apiKey --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/apple/certificate --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/login.md --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/status.md --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/dashboard.md --notDryRun --overWrite
bin/dev.js internal readme docs/ -d 2 --only docs/help.md --notDryRun --overWrite
