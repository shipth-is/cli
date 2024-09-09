#!/usr/bin/env -S /bin/sh -c '"$(dirname "$0")/../node_modules/.bin/tsx"  --tsconfig "$(dirname "$0")/../tsconfig.json" "$0" "$@"'

// Magic shebang to run TypeScript files with tsx from any directory

// Start the CLI
import {execute} from '@oclif/core'
await execute({development: true, dir: import.meta.url})
