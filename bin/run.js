#!/usr/bin/env -S node --no-deprecation

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
