import path from 'path'
import fs from 'fs'

// Check if the current working directory is a Godot game
// TODO: allow for cwd override
export function isCWDGodotGame(): boolean {
  const cwd = process.cwd()
  const godotProject = path.join(cwd, 'project.godot')
  return fs.existsSync(godotProject)
}
