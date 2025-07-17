export * from './baseAppleCommand.js'
export * from './baseAuthenticatedCommand.js'
export * from './baseCommand.js'
export * from './baseGameAndroidCommand.js'
export * from './baseGameCommand.js'

import {Flags} from '@oclif/core'

export const DetailsFlags = {
  androidPackageName: Flags.string({char: 'a', description: 'Set the Android package name'}),
  buildNumber: Flags.integer({char: 'b', description: 'Set the build number'}),
  gameEngine: Flags.string({char: 'e', description: 'Set the game engine'}),
  gameEngineVersion: Flags.string({char: 'v', description: 'Set the game engine version'}),
  gcpProjectId: Flags.string({char: 'g', description: 'Set the GCP project ID'}),
  gcpServiceAccountId: Flags.string({char: 'c', description: 'Set the GCP service account ID'}),
  iosBundleId: Flags.string({char: 'i', description: 'Set the iOS bundle ID'}),
  name: Flags.string({char: 'n', description: 'The name of the game'}),
  semanticVersion: Flags.string({char: 's', description: 'Set the semantic version'}),
}
