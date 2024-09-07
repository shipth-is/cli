#!/usr/bin/env -S /bin/sh -c '"$(dirname "$0")/../node_modules/.bin/tsx" "$0" "$@"'

// Start the CLI
import {execute} from '@oclif/core'
await execute({development: true, dir: import.meta.url})
