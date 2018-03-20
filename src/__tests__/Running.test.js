import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('Running', () => {
  it('should throw an error if Running component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Running />)).toThrow(
      '<AsyncCall.Running> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it("should render Running's children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>
          <div>abcdef</div>
        </AsyncCall.Running>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const runningContainer = container.childAt(0)
    expect(runningContainer).toBeDefined()
    expect(runningContainer).not.toHaveEmptyRender()
    expect(runningContainer.children().length).toBe(1)
    expect(runningContainer.childAt(0).text()).toBe('abcdef')
  })

  it("should render Running's children array if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>
          <div>abcdef</div>
          <div>bcdefg</div>
        </AsyncCall.Running>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const runningContainer = container.childAt(0)
    expect(runningContainer).toBeDefined()
    expect(runningContainer.children().length).toBe(2)
    expect(runningContainer.childAt(0).text()).toBe('abcdef')
    expect(runningContainer.childAt(1).text()).toBe('bcdefg')
  })

  it("should not render Running's children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(container.children().exists()).toBe(true)
    const runningContainer = container.childAt(0)
    expect(runningContainer).toBeDefined()
    expect(runningContainer).toHaveEmptyRender()

    done()
  })

  it("should not render Running's children if promise has been resolved and returned truthy value", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve('abcdef'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(container.children().exists()).toBe(true)
    const runningContainer = container.childAt(0)
    expect(runningContainer).toBeDefined()
    expect(runningContainer).toHaveEmptyRender()

    done()
  })

  it("should not render Running's children if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(container.children().exists()).toBe(true)
    const runningContainer = container.childAt(0)
    expect(runningContainer).toBeDefined()
    expect(runningContainer).toHaveEmptyRender()

    done()
  })

  it("should render Running's children whenever render-returning function is called second time", async done => {
    const AsyncCall = createAsyncCallComponent(x => Promise.resolve('abcdef'))
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.Running>
          <div>abcdef</div>
        </AsyncCall.Running>
      </AsyncCall>,
    )

    {
      await flushPromises()
      container.update()

      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveEmptyRender()
    }

    {
      container.setProps({ params: 2 })
      container.update()

      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).not.toHaveEmptyRender()
      expect(runningContainer).toBeDefined()
      expect(runningContainer.children().length).toBe(1)
      expect(runningContainer.childAt(0).text()).toBe('abcdef')
    }

    {
      await flushPromises()
      container.update()

      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveEmptyRender()
    }

    done()
  })
})
