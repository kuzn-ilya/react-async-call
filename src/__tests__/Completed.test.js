import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { flushPromises } from './common'

describe('Completed', () => {
  it('should be exposed as static prop from AsyncCall', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Completed).toBeDefined()
  })

  it('should expose default display names', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Completed.displayName).toBe('AsyncCall.Completed')
  })

  it('should throw an error if Completed component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Completed />)).toThrow(
      '<AsyncCall.Completed> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it("should not render Completed's children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Completed>
          <div>abcdef</div>
        </AsyncCall.Completed>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const completedContainer = container.childAt(0)
    expect(completedContainer).toBeDefined()
    expect(completedContainer).toHaveEmptyRender()
    expect(completedContainer.children().length).toBe(0)
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

    expect(container.children().exists()).toBe(true)
    const completedContainer = container.childAt(0)
    expect(completedContainer).toBeDefined()
    expect(completedContainer).not.toHaveEmptyRender()
    expect(completedContainer.children().length).toBe(1)
    expect(completedContainer.childAt(0).text()).toBe('abcdef')

    done()
  })

  it("should render Running's children if promise has been rejected", async done => {
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

    expect(container.children().exists()).toBe(true)
    const completedContainer = container.childAt(0)
    expect(completedContainer).toBeDefined()
    expect(completedContainer).not.toHaveEmptyRender()
    expect(completedContainer.children().length).toBe(1)
    expect(completedContainer.childAt(0).text()).toBe('abcdef')

    done()
  })
})
