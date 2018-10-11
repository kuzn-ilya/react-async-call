import * as React from 'react'
import { mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { getChildrenContainer, flushPromises } from './common'

describe('<Running>', () => {
  afterEach(jest.restoreAllMocks)

  it('should throw an error if <Running> component is rendered alone', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.Running />)).toThrow(
      '<AsyncCall.Running> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })
})

describe('<Running>', () => {
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
    expect(AsyncCall.Running).toBeDefined()
  })

  it('should expose default display name', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.Running.displayName).toBe('AsyncCall.Running')
  })

  it("should render <Running>'s children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>
          <div>abcdef</div>
        </AsyncCall.Running>
      </AsyncCall>,
    )

    const runningContainer = getChildrenContainer(container, AsyncCall.Running)
    expect(runningContainer).toExist()
    expect(runningContainer).not.toBeEmptyRender()
    expect(runningContainer).toHaveText('abcdef')
  })

  it("should render <Running>'s children array if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>
          <div>abcdef</div>
          <div>bcdefg</div>
        </AsyncCall.Running>
      </AsyncCall>,
    )

    const runningContainer = getChildrenContainer(container, AsyncCall.Running)
    expect(runningContainer.children().length).toBe(2)
    expect(runningContainer.childAt(0)).toHaveText('abcdef')
    expect(runningContainer.childAt(1)).toHaveText('bcdefg')
  })

  it("should not render <Running>'s children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const runningContainer = getChildrenContainer(container, AsyncCall.Running)
    expect(runningContainer).toExist()
    expect(runningContainer).toBeEmptyRender()

    done()
  })

  it("should not render <Running>'s children if promise has been resolved and returned truthy value", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve('abcdef'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const runningContainer = getChildrenContainer(container, AsyncCall.Running)
    expect(runningContainer).toExist()
    expect(runningContainer).toBeEmptyRender()

    done()
  })

  it("should not render <Running>'s children if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Running>abcdef</AsyncCall.Running>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const runningContainer = getChildrenContainer(container, AsyncCall.Running)
    expect(runningContainer).toExist()
    expect(runningContainer).toBeEmptyRender()

    done()
  })

  it("should render <Running>'s children when render-returning function is called second time", async done => {
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

      const runningContainer = getChildrenContainer(container, AsyncCall.Running)
      expect(runningContainer).toExist()
      expect(runningContainer).toBeEmptyRender()
    }

    {
      container.setProps({ params: 2 })
      container.update()

      const runningContainer = getChildrenContainer(container, AsyncCall.Running)
      expect(runningContainer).toExist()
      expect(runningContainer).not.toBeEmptyRender()
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveText('abcdef')
    }

    {
      await flushPromises()
      container.update()

      const runningContainer = getChildrenContainer(container, AsyncCall.Running)
      expect(runningContainer).toExist()
      expect(runningContainer).toBeEmptyRender()
    }

    done()
  })
})
