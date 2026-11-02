import {expect} from 'chai'

import {Project, SimulatorSession} from '@cli/types'
import {
  getShipMode,
  getSimulatorCompleteMessage,
  getSimulatorFlagError,
  SIMULATOR_INSTALLING_MESSAGE,
  SIMULATOR_SAVED_MESSAGE,
} from '@cli/utils/ship/simulator.js'

const GAME_ID = 'b8b2701f-6b77-4e5b-82e0-4518619fb5c4'
const OTHER_GAME_ID = '21702a3b-1111-2222-3333-444455556666'

const makeProject = (useDemoCredentials?: boolean) => ({details: {useDemoCredentials}}) as Project
const makeSession = (projectId: null | string) => ({projectId}) as SimulatorSession

describe('getSimulatorFlagError (ship/simulator)', () => {
  it('allows --simulator with --platform ios', () => {
    expect(getSimulatorFlagError({platform: 'ios', simulator: true})).to.equal(null)
  })

  it('refuses --simulator with --platform android', () => {
    expect(getSimulatorFlagError({platform: 'android', simulator: true})).to.equal('--simulator is only for iOS builds')
  })

  it('refuses --simulator with --download or --downloadAPK', () => {
    const error = '--download is not available for simulator builds yet'
    expect(getSimulatorFlagError({download: 'game.ipa', platform: 'ios', simulator: true})).to.equal(error)
    expect(getSimulatorFlagError({downloadAPK: 'game.apk', platform: 'ios', simulator: true})).to.equal(error)
  })

  it('checks nothing without --simulator', () => {
    expect(getSimulatorFlagError({download: 'game.aab', platform: 'android'})).to.equal(null)
  })
})

describe('getShipMode (ship/simulator)', () => {
  it('forces demo credentials for --simulator, so the store key check is skipped', () => {
    const mode = getShipMode({simulator: true}, makeProject(false))
    expect(mode).to.deep.equal({isPublishing: false, isUsingDemoCredentials: true})
  })

  it('forces demo credentials even with --useDemoCredentials=false', () => {
    const mode = getShipMode({simulator: true, useDemoCredentials: false}, makeProject(false))
    expect(mode.isUsingDemoCredentials).to.equal(true)
  })

  it('publishes a normal ship', () => {
    const mode = getShipMode({}, makeProject(false))
    expect(mode).to.deep.equal({isPublishing: true, isUsingDemoCredentials: false})
  })

  it('uses the game setting when the flag is not given', () => {
    expect(getShipMode({}, makeProject(true)).isUsingDemoCredentials).to.equal(true)
    expect(getShipMode({useDemoCredentials: false}, makeProject(true)).isUsingDemoCredentials).to.equal(false)
  })

  it('does not publish with --skipPublish', () => {
    expect(getShipMode({skipPublish: true}, makeProject(false)).isPublishing).to.equal(false)
  })
})

describe('getSimulatorCompleteMessage (ship/simulator)', () => {
  it('says saved when there is no session', () => {
    expect(getSimulatorCompleteMessage(null, GAME_ID)).to.equal(SIMULATOR_SAVED_MESSAGE)
  })

  it('says saved when the session is for another game', () => {
    expect(getSimulatorCompleteMessage(makeSession(OTHER_GAME_ID), GAME_ID)).to.equal(SIMULATOR_SAVED_MESSAGE)
    expect(getSimulatorCompleteMessage(makeSession(null), GAME_ID)).to.equal(SIMULATOR_SAVED_MESSAGE)
  })

  it('says installing when the session is for this game', () => {
    expect(getSimulatorCompleteMessage(makeSession(GAME_ID), GAME_ID)).to.equal(SIMULATOR_INSTALLING_MESSAGE)
  })
})
