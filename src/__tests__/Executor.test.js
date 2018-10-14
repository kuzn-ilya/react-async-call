import * as React from 'react'
import { mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { MINIFIED_INVARIANT_MESSAGE } from './utils'

describe('<Executor>', () => {
  let spyOnConsoleError

  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(jest.restoreAllMocks)

  it('should throw an error if <Executor> component is rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.Executor>{() => void 0}</AsyncCall.Executor>)).toThrow(
      process.env.NODE_ENV !== 'production'
        ? '<AsyncCall.Executor> must be a child (direct or indirect) of <AsyncCall>.'
        : MINIFIED_INVARIANT_MESSAGE,
    )
  })

  if (process.env.NODE_ENV !== 'production') {
    it('should throw an error if `children` property is not set', () => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      mount(
        <AsyncCall params="first">
          <AsyncCall.Executor />
        </AsyncCall>,
      )

      expect(spyOnConsoleError).toHaveBeenCalled()
      expect(spyOnConsoleError.mock.calls[0][0]).toContain(
        'The prop `children` is marked as required in `AsyncCall.Executor`, but its value is `undefined`',
      )
    })
  } else {
    it('should not throw an error if `children` property is not set', () => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      mount(
        <AsyncCall params="first">
          <AsyncCall.Executor />
        </AsyncCall>,
      )

      expect(spyOnConsoleError).not.toHaveBeenCalled()
    })
  }
})

describe('<Executor>', () => {
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
    expect(AsyncCall.Executor).toBeDefined()
  })

  if (process.env.NODE_ENV !== 'production') {
    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Executor.displayName).toBe('AsyncCall.Executor')
    })
  } else {
    it('should not expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Executor.displayName).not.toBeDefined()
    })
    it('should not expose propTypes', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Executor.propTypes).not.toBeDefined()
    })
  }

  it("render props: should pass `execute` method as a children's argument", () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(execute => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Executor>{children}</AsyncCall.Executor>
      </AsyncCall>,
    )
    expect(container).toExist()
    expect(children).toHaveBeenCalledWith({ execute: container.instance().execute })
  })
})
