import path from 'path'
import fs from 'fs'

export * from './dates.js'
export * from './query/index.js'

// Check if the current working directory is a Godot game
// TODO: allow for cwd override
export function isCWDGodotGame(): boolean {
  const cwd = process.cwd()
  const godotProject = path.join(cwd, 'project.godot')
  return fs.existsSync(godotProject)
}

export function getShortUUID(originalUuid: string): string {
  // A short git commit hash is an abbreviation of the hash to the first 7 characters
  // It should be unique within the users account
  return originalUuid.slice(0, 8)
}
