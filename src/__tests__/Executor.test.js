import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

describe('Executor', () => {
  describe('invariants', () => {
    it('should be exposed as static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Executor).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Executor.displayName).toBe('AsyncCall.Executor')
    })

    describe('', () => {
      let spy

      beforeEach(() => {
        spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      })

      afterEach(() => {
        spy.mockRestore()
      })

      it('should throw an error if Executor component rendered alone', () => {
        const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
        expect(() => mount(<AsyncCall.Executor>{() => void 0}</AsyncCall.Executor>)).toThrow(
          '<AsyncCall.Executor> must be a child (direct or indirect) of <AsyncCall>.',
        )
      })

      it('should throw an error if children is not passed', () => {
        const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
        mount(
          <AsyncCall params="first">
            <AsyncCall.Executor />
          </AsyncCall>,
        )

        expect(spy).toHaveBeenCalled()
        expect(spy.mock.calls[0][0]).toContain(
          'The prop `children` is marked as required in `AsyncCall.Executor`, but its value is `undefined`',
        )
      })
    })
  })

  describe('render props', () => {
    it("should pass execute fn as a children's argument", () => {
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
})
