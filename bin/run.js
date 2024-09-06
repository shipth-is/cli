#!/usr/bin/env node

// Enable our loader
import {register} from 'node:module'
import {pathToFileURL} from 'node:url'
import path from 'node:path'
const __dirname = new URL('.', import.meta.url).pathname
const loaderURL = pathToFileURL(path.join(__dirname, 'loader.js'))
// So that the loader finds the tsconfig.json
process.env.TS_NODE_PROJECT = path.join(__dirname, '..', 'tsconfig.json')
register(loaderURL)

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
