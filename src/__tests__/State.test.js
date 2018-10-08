import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { flushPromises } from './common'

describe('<State>', () => {
  describe('invariants', () => {
    it('should be exposed as a static prop from <AsyncCall>', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.State).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.State.displayName).toBe('AsyncCall.State')
    })
  })
})

describe('invariants', () => {
  let spy

  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    spy.mockRestore()
  })

  it('should throw an error if <State> component is rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.State>{() => {}}</AsyncCall.State>)).toThrow(
      '<AsyncCall.State> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it('should throw an error `children` property is not set', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    mount(
      <AsyncCall params="first">
        <AsyncCall.State />
      </AsyncCall>,
    )
    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toContain(
      'The prop `children` is marked as required in `AsyncCall.State`, but its value is `undefined`',
    )
  })

  describe('render props', () => {
    it('should call `children` and pass { running: true, rejected: false, resolved: false, execute: <fn> } as an argument if promise has not been resolved yet', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.State>{children}</AsyncCall.State>
        </AsyncCall>,
      )

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        resolved: false,
        rejected: false,
        execute: container.instance().execute,
      })
    })

    it('should call `children` and pass { running: false, result: 42, resolved: true, rejected: false } as an argument if promise has been resolved', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.State>{children}</AsyncCall.State>
        </AsyncCall>,
      )

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        resolved: false,
        rejected: false,
        execute: container.instance().execute,
      })

      await flushPromises()

      expect(children).toHaveBeenLastCalledWith({
        running: false,
        resolved: true,
        result: 42,
        rejected: false,
        execute: container.instance().execute,
      })

      done()
    })

    it("should call `children` and pass { running: false, resolved: false, rejected: true, rejectReason: 'rejected' } as an argument if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.State>{children}</AsyncCall.State>
        </AsyncCall>,
      )

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        resolved: false,
        execute: container.instance().execute,
      })

      await flushPromises()

      expect(children).toHaveBeenLastCalledWith({
        running: false,
        rejected: true,
        resolved: false,
        rejectReason: 'rejected',
        execute: container.instance().execute,
      })

      done()
    })

    it('should call `children` and pass { running: true, rejected: false, resolved: false } as an argument if promise-returning function is called the second time after promise resolving', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params="first">
          <AsyncCall.State>{children}</AsyncCall.State>
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: 'second' })

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        resolved: false,
        execute: container.instance().execute,
      })

      done()
    })

    it('should call `children` and pass { running: true, rejected: false, resolved: false } as an argument if promise-returning function is called the second time after promise rejection', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{ a: 1 }}>
          <AsyncCall.State>{children}</AsyncCall.State>
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: { a: 2 } })

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        resolved: false,
        execute: container.instance().execute,
      })

      done()
    })
  })
})
