export * from './baseAppleCommand.js'
export * from './baseAuthenticatedCommand.js'
export * from './baseCommand.js'
export * from './baseGameAndroidCommand.js'
export * from './baseGameCommand.js'

import {Flags} from '@oclif/core'

export const DetailsFlags = {
  buildNumber: Flags.integer({char: 'b', description: 'Set the build number'}),
  semanticVersion: Flags.string({char: 's', description: 'Set the semantic version'}),
  gameEngine: Flags.string({char: 'e', description: 'Set the game engine'}),
  gameEngineVersion: Flags.string({char: 'v', description: 'Set the game engine version'}),
  iosBundleId: Flags.string({char: 'i', description: 'Set the iOS bundle ID'}),
  androidPackageName: Flags.string({char: 'a', description: 'Set the Android package name'}),
}
