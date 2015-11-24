import expect from 'expect'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describePush from './describePush'
import describeReplaceState from './describeReplaceState'
import describeReplace from './describeReplace'
import describePopState from './describePopState'
import describeQueryKey from './describeQueryKey'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('hash history', function () {
  let unlisten
  beforeEach(function () {
    if (window.location.hash !== '/')
      window.location.hash = '/'
  })
  afterEach(function () {
    if (unlisten)
      unlisten()
  })

  describeInitialLocation(createHashHistory)
  describeTransitions(createHashHistory)
  describePushState(createHashHistory)
  describePush(createHashHistory)
  describeReplaceState(createHashHistory)
  describeReplace(createHashHistory)
  describeBasename(createHashHistory)
  describeQueries(createHashHistory)

  if (supportsHistory()) {
    describePopState(createHashHistory)
  } else {
    describe.skip(null, function () {
      describePopState(createHashHistory)
    })
  }

  if (supportsHistory() && supportsGoWithoutReloadUsingHash()) {
    describeGo(createHashHistory)
    describeQueryKey(createHashHistory)
  } else {
    describe.skip(null, function () {
      describeGo(createHashHistory)
      describeQueryKey(createHashHistory)
    })
  }

  it('knows how to make hrefs', function () {
    let history = createHashHistory()
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })

  it('should ignore hashes without /', function (done) {

    let history = createHashHistory()
    let spy = expect.spyOn(history, 'transitionTo')

    unlisten = history.listenBefore(() => {
    })

    window.location.hash = 'invalid'

    setTimeout(function () {
      expect(spy).toNotHaveBeenCalled()
      spy.restore()
      expect.restoreSpies()
      done()
    }, 100)


  })
  it('should handle hashes with /', function (done) {

    let history = createHashHistory()
    let spy = expect.spyOn(history, 'transitionTo')

    unlisten = history.listenBefore(() => {
    })


    window.location.hash = '/valid'

    setTimeout(function () {
      expect(spy).toHaveBeenCalled()
      expect(spy.calls[0].arguments[0].pathname).toBe('/valid')
      spy.restore()
      expect.restoreSpies()
      done()
    }, 100)


  })
})
