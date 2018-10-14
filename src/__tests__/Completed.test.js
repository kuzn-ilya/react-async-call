import * as React from 'react'
import { mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { getChildrenContainer, flushPromises, MINIFIED_INVARIANT_MESSAGE } from './utils'

describe('<Completed>', () => {
  afterEach(jest.restoreAllMocks)

  it('should throw an error if <Completed> component is rendered alone', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.Completed />)).toThrow(
      process.env.NODE_ENV !== 'production'
        ? '<AsyncCall.Completed> must be a child (direct or indirect) of <AsyncCall>.'
        : MINIFIED_INVARIANT_MESSAGE,
    )
  })
})

describe('<Completed>', () => {
  let spyOnConsoleError
  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    expect(spyOnConsoleError).not.toHaveBeenCalled()
  })

  it('should be exposed as a static prop from <AsyncCall>', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Completed).toBeDefined()
  })

  if (process.env.NODE_ENV !== 'production') {
    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Completed.displayName).toBe('AsyncCall.Completed')
    })
  } else {
    it('should not expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Completed.displayName).not.toBeDefined()
    })

    it('should not expose propTypes', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Completed.propTypes).not.toBeDefined()
    })
  }

  it("should not render <Completed>'s children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Completed>
          <div>abcdef</div>
        </AsyncCall.Completed>
      </AsyncCall>,
    )

    const completedContainer = getChildrenContainer(container, AsyncCall.Completed)
    expect(completedContainer).toBeEmptyRender()
  })

  it("should render <Completed>'s children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Completed>
          <div>abcdef</div>
        </AsyncCall.Completed>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const completedContainer = getChildrenContainer(container, AsyncCall.Completed)
    expect(completedContainer).not.toBeEmptyRender()
    expect(completedContainer).toHaveText('abcdef')

    done()
  })

  it("should render <Completed>'s children if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Completed>
          <div>abcdef</div>
        </AsyncCall.Completed>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const completedContainer = getChildrenContainer(container, AsyncCall.Completed)
    expect(completedContainer).not.toBeEmptyRender()
    expect(completedContainer).toHaveText('abcdef')

    done()
  })
})
