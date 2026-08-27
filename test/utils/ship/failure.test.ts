import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {expect} from 'chai'
import ejs from 'ejs'

import {Job, Platform} from '@cli/types'
import {getShipFailureVars} from '@cli/utils/ship/failure.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(__dirname, '../../../assets/markdown/ship-failure.md.ejs')

const GAME_ID = 'b8b2701f-6b77-4e5b-82e0-4518619fb5c4'
const IOS_JOB_ID = 'e69a082b-4e33-4676-bd53-b8cfc28e2d7d'
const ANDROID_JOB_ID = '21702a3b-1111-2222-3333-444455556666'

const makeJob = (id: string, type: Platform) => ({id, type}) as Job

// Renders the real template, so the test fails if the two stop agreeing
const render = (failedJobs: Job[], showLogTail: boolean) => {
  const template = fs.readFileSync(templatePath, 'utf8')
  const vars = getShipFailureVars(failedJobs, GAME_ID, {showLogTail})
  return {text: ejs.render(template, vars), vars}
}

describe('getShipFailureVars (utils/ship/failure)', () => {
  it('shortens the ids and names the platform', () => {
    const {failures} = getShipFailureVars([makeJob(IOS_JOB_ID, Platform.IOS)], GAME_ID, {showLogTail: true})

    expect(failures).to.have.length(1)
    expect(failures[0].jobId).to.equal('e69a082b')
    expect(failures[0].platform).to.equal('iOS')
    expect(failures[0].logsCommand).to.equal('shipthis game job logs e69a082b')
    expect(failures[0].dashboardUrl).to.contain('games/b8b2701f/job/e69a082b')
  })

  it('describes every failed job, not only the first', () => {
    const jobs = [makeJob(IOS_JOB_ID, Platform.IOS), makeJob(ANDROID_JOB_ID, Platform.ANDROID)]
    const {failures} = getShipFailureVars(jobs, GAME_ID, {showLogTail: true})

    expect(failures.map((f) => f.platform)).to.deep.equal(['iOS', 'Android'])
    expect(failures.map((f) => f.jobId)).to.deep.equal(['e69a082b', '21702a3b'])
  })
})

describe('ship-failure.md.ejs', () => {
  it('names the platform and the job that failed', () => {
    const {text} = render([makeJob(IOS_JOB_ID, Platform.IOS)], true)

    expect(text).to.contain('The iOS build failed (job e69a082b).')
    expect(text).to.contain('shipthis game job logs e69a082b')
  })

  it('promises the log tail only when a tail follows', () => {
    const jobs = [makeJob(IOS_JOB_ID, Platform.IOS)]

    expect(render(jobs, true).text).to.contain('The last 25 lines')
    expect(render(jobs, false).text).to.not.contain('lines of each failed job')
  })

  it('links every failed job to the dashboard', () => {
    const jobs = [makeJob(IOS_JOB_ID, Platform.IOS), makeJob(ANDROID_JOB_ID, Platform.ANDROID)]
    const {text, vars} = render(jobs, false)

    expect(text).to.contain('2 of the builds for your game failed.')
    for (const failure of vars.failures) {
      expect(text).to.contain(failure.dashboardUrl)
      expect(text).to.contain(failure.logsCommand)
    }
  })

  it('keeps the help links', () => {
    const {text} = render([makeJob(IOS_JOB_ID, Platform.IOS)], true)

    expect(text).to.contain('https://discord.gg/HuSvK4GT')
    expect(text).to.contain('https://github.com/shipth-is/cli/issues')
  })
})
