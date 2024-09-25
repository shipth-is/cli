import git from 'isomorphic-git'
import {promises as fs} from 'fs'

export type GitInfo = {
  gitCommitHash?: string
  gitBranch?: string
}

// Checks if the current working directory is a git repository
export async function isCWDGitRepo(): Promise<boolean> {
  const dir = process.cwd()
  try {
    await git.log({fs, dir, depth: 1})
    return true
  } catch (e) {
    return false
  }
}

// Gets the git information for the current working directory
export async function getCWDGitInfo(): Promise<GitInfo> {
  const dir = process.cwd()
  const empty: GitInfo = {}
  try {
    const commits = await git.log({fs, dir, depth: 1})
    const branch = await git.currentBranch({
      fs,
      dir,
      fullname: false,
    })
    return {
      gitCommitHash: commits[0].oid,
      gitBranch: branch as string | undefined,
    }
  } catch (e) {
    return empty
  }
}
