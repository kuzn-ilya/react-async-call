import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { flushPromises } from './common'

describe('Completed', () => {
  describe('invariants', () => {
    it('should be exposed as a static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Completed).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Completed.displayName).toBe('AsyncCall.Completed')
    })

    it('should throw an error if Completed component rendered alone', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(() => shallow(<AsyncCall.Completed />)).toThrow(
        '<AsyncCall.Completed> must be a child (direct or indirect) of <AsyncCall>.',
      )
    })
  })

  describe('children', () => {
    it("should not render Completed's children if promise has not been resolved yet", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Completed>
            <div>abcdef</div>
          </AsyncCall.Completed>
        </AsyncCall>,
      )

      const completedContainer = container.find(AsyncCall.Completed)
      expect(completedContainer).toBeEmptyRender()
    })

    it("should render Completed's children if promise has been resolved", async done => {
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

      const completedContainer = container.find(AsyncCall.Completed)
      expect(completedContainer).not.toBeEmptyRender()
      expect(completedContainer).toHaveText('abcdef')

      done()
    })

    it("should render Completed's children if promise has been rejected", async done => {
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

      const completedContainer = container.find(AsyncCall.Completed)
      expect(completedContainer).not.toBeEmptyRender()
      expect(completedContainer).toHaveText('abcdef')

      done()
    })
  })
})
