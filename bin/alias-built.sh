#!/bin/bash

# you should run:
#   source ./alias.sh

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

shipthis="$scriptDir/run.js"

alias shipthis="$shipthis"
