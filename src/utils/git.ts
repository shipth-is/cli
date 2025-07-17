import {promises as fs} from 'node:fs'

import git from 'isomorphic-git'

export type GitInfo = {
  gitBranch?: string
  gitCommitHash?: string
}

// Checks if the current working directory is a git repository
export async function isCWDGitRepo(): Promise<boolean> {
  const dir = process.cwd()
  try {
    await git.log({depth: 1, dir, fs})
    return true
  } catch {
    return false
  }
}

// Gets the git information for the current working directory
export async function getCWDGitInfo(): Promise<GitInfo> {
  const dir = process.cwd()
  const empty: GitInfo = {}
  try {
    const commits = await git.log({depth: 1, dir, fs})
    const branch = await git.currentBranch({
      dir,
      fs,
      fullname: false,
    })
    return {
      gitBranch: branch as string | undefined,
      gitCommitHash: commits[0].oid,
    }
  } catch {
    return empty
  }
}
