import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { flushPromises } from './common'

describe('Rejected', () => {
  describe('invariants', () => {
    it('should be exposed as static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Rejected).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Rejected.displayName).toBe('AsyncCall.Rejected')
    })

    it('should throw an error if Rejected component rendered alone', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(() => shallow(<AsyncCall.Rejected />)).toThrow(
        '<AsyncCall.Rejected> must be a child (direct or indirect) of <AsyncCall>.',
      )
    })
  })

  describe('children', () => {
    it("should not render Rejected's children if promise has not been resolved yet", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Rejected>abcdef</AsyncCall.Rejected>
        </AsyncCall>,
      )

      const rejectedContainer = container.find(AsyncCall.Rejected)
      expect(rejectedContainer).toExist()
      expect(rejectedContainer).toBeEmptyRender()
    })

    it("should not render Rejected's children if promise has been resolved", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Rejected>abcdef</AsyncCall.Rejected>
        </AsyncCall>,
      )

      await flushPromises()

      const rejectedContainer = container.find(AsyncCall.Rejected)
      expect(rejectedContainer).toExist()
      expect(rejectedContainer).toBeEmptyRender()

      done()
    })

    it("should render Rejected's children if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Rejected>
            <div>abcdef</div>
          </AsyncCall.Rejected>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      const rejectedContainer = container.find(AsyncCall.Rejected)
      expect(rejectedContainer).toExist()
      expect(rejectedContainer).not.toBeEmptyRender()
      expect(rejectedContainer).toHaveText('abcdef')

      done()
    })

    it("should render Rejected's children array if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Rejected>
            <div>abcdef</div>
            <div>cdefgh</div>
          </AsyncCall.Rejected>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      const rejectedContainer = container.find(AsyncCall.Rejected)

      expect(rejectedContainer.children().length).toBe(2)
      expect(rejectedContainer.childAt(0)).toHaveText('abcdef')
      expect(rejectedContainer.childAt(1)).toHaveText('cdefgh')

      done()
    })

    it("should not render Rejected's children if promise has not been resolved the second time", async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.reject(value))
      const container = mount(
        <AsyncCall params="first">
          <AsyncCall.Rejected>{({ rejectReason }) => rejectReason}</AsyncCall.Rejected>
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: 'second' })

      const rejectedContainer = container.find(AsyncCall.Rejected)
      expect(rejectedContainer).toExist()
      expect(rejectedContainer).toBeEmptyRender()

      done()
    })
  })

  describe('render props', () => {
    it("should call Rejected's children fn if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error:'))
      const children = jest.fn(({ rejectReason }) => (
        <div>
          {rejectReason}
          {'abcdef'}
        </div>
      ))
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Rejected>{children}</AsyncCall.Rejected>
        </AsyncCall>,
      )

      expect(children).not.toHaveBeenCalled()
      await flushPromises()

      expect(children).toHaveBeenCalledTimes(1)
      expect(children).toHaveBeenCalledWith({ rejectReason: 'error:' })

      expect(container).toHaveText('error:abcdef')

      done()
    })
  })
})
