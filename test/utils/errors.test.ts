import {expect} from 'chai'

import {getResponseError, isRetryable} from '@cli/utils/errors.js'

describe('getResponseError (utils/errors)', () => {
  it('names what failed and keeps the status', () => {
    const error = getResponseError(new Response('no', {status: 403, statusText: 'Forbidden'}), 'Part 3')

    expect(error).to.be.instanceOf(Error)
    expect(error.message).to.equal('Part 3 failed: 403 Forbidden')
    expect(error.status).to.equal(403)
  })
})

describe('isRetryable (utils/errors)', () => {
  it('retries an error that has no status', () => {
    expect(isRetryable(new Error('fetch failed'))).to.equal(true)
  })

  it('retries a server error and the two wait-and-see client errors', () => {
    expect(isRetryable({status: 503})).to.equal(true)
    expect(isRetryable({status: 408})).to.equal(true)
    expect(isRetryable({status: 429})).to.equal(true)
  })

  it('does not retry the other client errors', () => {
    expect(isRetryable({status: 400})).to.equal(false)
    expect(isRetryable({status: 401})).to.equal(false)
    expect(isRetryable({status: 404})).to.equal(false)
  })

  // An authenticated call cannot recover from a 403. A caller that can, such as
  // uploadPart with a stale signed URL, handles its own 403.
  it('does not retry a 403', () => {
    expect(isRetryable({status: 403})).to.equal(false)
  })

  it('reads the status axios sets on the errors it throws', () => {
    expect(isRetryable(getResponseError(new Response('no', {status: 404}), 'Part 1'))).to.equal(false)
  })
})
