import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('Resolved', () => {
  it('should throw an error if Resolved component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Resolved />)).toThrow(
      '<AsyncCall.Resolved> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it("should not render Resolved's children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const resolvedContainer = container.childAt(0)
    expect(resolvedContainer).toBeDefined()
    expect(resolvedContainer).toHaveEmptyRender()
  })

  it("should not render Resolved's children if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    expect(container.children().exists()).toBe(true)
    const resolvedContainer = container.childAt(0)
    expect(resolvedContainer).toBeDefined()
    expect(resolvedContainer).toHaveEmptyRender()

    done()
  })

  it("should render Resolved's children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(container.children().exists()).toBe(true)
    const resolvedContainer = container.childAt(0)
    expect(resolvedContainer).toBeDefined()
    expect(resolvedContainer).not.toHaveEmptyRender()
    expect(resolvedContainer.text()).toBe('abcdef')

    done()
  })

  it("should render Resolved's children array if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>
          <div>abcdef</div>
          <div>qwerty</div>
        </AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(container.children().exists()).toBe(true)
    const resolvedContainer = container.childAt(0)
    expect(resolvedContainer).toBeDefined()
    expect(resolvedContainer.children().length).toBe(2)
    expect(resolvedContainer.childAt(0).text()).toBe('abcdef')
    expect(resolvedContainer.childAt(1).text()).toBe('qwerty')

    done()
  })

  it("should not render Resolved's children if promise has not been resolved the second time", async done => {
    const fn = jest.fn(value => Promise.resolve(value))
    const AsyncCall = createAsyncCallComponent(fn)
    const container = mount(
      <AsyncCall params="first">
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()

    container.instance().execute()

    expect(fn).toHaveBeenCalledTimes(2)
    const resolvedContainer = container.childAt(0)
    expect(resolvedContainer).toBeDefined()
    expect(resolvedContainer).toHaveEmptyRender()

    done()
  })

  it('should not clash two promise renderers', async done => {
    const FirstPromiseRenderer = createAsyncCallComponent(() => Promise.resolve('first'))
    const SecondPromiseRenderer = createAsyncCallComponent(() => Promise.resolve('second'))
    const secondContainer = mount(
      <SecondPromiseRenderer params={{}}>
        <FirstPromiseRenderer params={{}}>
          <FirstPromiseRenderer.Resolved>first</FirstPromiseRenderer.Resolved>
          <SecondPromiseRenderer.Resolved>second</SecondPromiseRenderer.Resolved>
        </FirstPromiseRenderer>
      </SecondPromiseRenderer>,
    )

    expect(secondContainer).toBeDefined()
    await flushPromises()

    const firstContainer = secondContainer.childAt(0)
    expect(firstContainer).toBeDefined()

    const firstChild = firstContainer.childAt(0)
    expect(firstChild).toBeDefined()
    expect(firstChild.text()).toBe('first')

    const secondChild = firstContainer.childAt(1)
    expect(secondChild).toBeDefined()
    expect(secondChild.text()).toBe('second')

    done()
  })
})
