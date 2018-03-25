import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('Rejected', () => {
  it('should be exposed as static prop from AsyncCall', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Rejected).toBeDefined()
  })

  it('should expose default display names', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Rejected.displayName).toBe('AsyncCall.Rejected')
  })

  it('should throw an error if Rejected component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Rejected />)).toThrow(
      '<AsyncCall.Rejected> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it("should not render Rejected's children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Rejected>abcdef</AsyncCall.Rejected>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const rejectedContainer = container.childAt(0)
    expect(rejectedContainer).toBeDefined()
    expect(rejectedContainer).toHaveEmptyRender()
  })

  it("should not render Rejected's children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Rejected>abcdef</AsyncCall.Rejected>
      </AsyncCall>,
    )

    await flushPromises()

    expect(container.children().exists()).toBe(true)
    const rejectedContainer = container.childAt(0)
    expect(rejectedContainer).toBeDefined()
    expect(rejectedContainer).toHaveEmptyRender()

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

    expect(container.children().exists()).toBe(true)
    const rejectedContainer = container.childAt(0)
    expect(rejectedContainer).toBeDefined()
    expect(rejectedContainer).not.toHaveEmptyRender()
    expect(rejectedContainer.text()).toBe('abcdef')

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

    expect(container.children().exists()).toBe(true)
    const rejectedContainer = container.childAt(0)
    expect(rejectedContainer).toBeDefined()
    expect(rejectedContainer.children().length).toBe(2)
    expect(rejectedContainer.childAt(0).text()).toBe('abcdef')
    expect(rejectedContainer.childAt(1).text()).toBe('cdefgh')

    done()
  })

  it("should call Rejected's children fn if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error:'))
    const children = jest.fn(reason => (
      <div>
        {reason}
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
    expect(children).toHaveBeenCalledWith('error:')

    expect(container.text()).toBe('error:abcdef')

    done()
  })

  it("should not render Rejected's children if promise has not been resolved the second time", async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.reject(value))
    const container = mount(
      <AsyncCall params="first">
        <AsyncCall.Rejected>{result => result}</AsyncCall.Rejected>
      </AsyncCall>,
    )

    await flushPromises()
    container.setProps({ params: 'second' })

    const rejectedContainer = container.childAt(0)
    expect(rejectedContainer).toBeDefined()
    expect(rejectedContainer).toHaveEmptyRender()

    done()
  })
})
