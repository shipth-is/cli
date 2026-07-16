import {Flags} from '@oclif/core'

export * from './cacheKeys.js'
export * from './config.js'

export const DetailsFlags = {
  androidPackageName: Flags.string({char: 'a', description: 'Set the Android package name'}),
  buildNumber: Flags.integer({char: 'b', description: 'Set the build number'}),
  gameEngine: Flags.string({char: 'e', description: 'Set the game engine'}),
  gameEngineVersion: Flags.string({char: 'v', description: 'Set the game engine version'}),
  // No short char: -g is reserved CLI-wide for --gameId (see BaseGameCommand)
  gcpProjectId: Flags.string({description: 'Set the GCP project ID'}),
  gcpServiceAccountId: Flags.string({char: 'c', description: 'Set the GCP service account ID'}),
  iosBundleId: Flags.string({char: 'i', description: 'Set the iOS bundle ID'}),
  liquidGlassIconPath: Flags.string({char: 'l', description: 'Set the Liquid Glass icon path'}),
  name: Flags.string({char: 'n', description: 'The name of the game'}),
  semanticVersion: Flags.string({char: 's', description: 'Set the semantic version'}),
  useDemoCredentials: Flags.string({
    char: 'd',
    description: 'Use demo credentials for this project',
    options: ['true', 'false'],
  }),
}
