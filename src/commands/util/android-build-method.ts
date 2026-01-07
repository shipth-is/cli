import {Flags} from '@oclif/core'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {isGradleBuildEnabled, setGradleBuildEnabled} from '@cli/utils/godot.js'

export default class UtilAndroidBuildMethod extends BaseCommand<typeof UtilAndroidBuildMethod> {
  static override args = {}
  static override description = 'Gets and sets the Android build method in export_presets.cfg'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --legacy',
    '<%= config.bin %> <%= command.id %> --gradle',
  ]

  static override flags = {
    legacy: Flags.boolean({char: 'l', description: 'use legacy build method'}),
    gradle: Flags.boolean({char: 'g', description: 'use gradle build method'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(UtilAndroidBuildMethod)

    if (flags.legacy && flags.gradle) {
      this.error('Cannot use both --legacy and --gradle flags together')
    }

    if (!flags.legacy && !flags.gradle) {
      // Show current build method
      const buildMethod = (await isGradleBuildEnabled()) ? 'gradle' : 'legacy'
      this.log(`Current Android build method: ${buildMethod}`)
      return
    }

    const isGradle = flags.gradle ? true : false
    const buildMethod = flags.legacy ? 'legacy' : 'gradle'
    this.log(`Setting Android build method to: ${buildMethod}`)
    // Set the build method in the export presets file
    await setGradleBuildEnabled(isGradle)
  }
}
