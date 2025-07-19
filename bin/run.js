#!/usr/bin/env -S node --no-deprecation --experimental-json-modules

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
