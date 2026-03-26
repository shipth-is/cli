import {Command} from '@oclif/core'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {ShipGameFlags} from '@cli/types'

export type LogFunction = (message: string) => void

// Takes the current command so we can get the project config
// This could be made more composable
export interface ShipOptions {
  command: BaseCommand<typeof Command>
  log?: LogFunction
  shipFlags?: ShipGameFlags // If provided, will override command flags
}

