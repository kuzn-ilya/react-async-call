import * as React from 'react'
import { mount } from 'enzyme'
import { MINIFIED_INVARIANT_MESSAGE } from './utils'

import createAsyncCallComponent from '../index'
import { getChildrenContainer, getAsyncCallChildrenContainer, flushPromises } from './utils'

describe('<Resolved>', () => {
  afterEach(jest.restoreAllMocks)

  it('should throw an error if <Resolved> component is rendered alone', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.Resolved />)).toThrow(
      process.env.NODE_ENV !== 'production'
        ? '<AsyncCall.Resolved> must be a child (direct or indirect) of <AsyncCall>.'
        : MINIFIED_INVARIANT_MESSAGE,
    )
  })
})

describe('<Resolved>', () => {
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
    expect(AsyncCall.Resolved).toBeDefined()
  })

  if (process.env.NODE_ENV !== 'production') {
    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Resolved.displayName).toBe('AsyncCall.Resolved')
    })
  } else {
    it('should not expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Resolved.displayName).not.toBeDefined()
    })

    it('should not expose propTypes', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Resolved.propTypes).not.toBeDefined()
    })
  }

  it("render props: should not call <Resolved>'s `children` function if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const children = jest.fn(() => void 0)
    mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
      </AsyncCall>,
    )

    expect(children).not.toHaveBeenCalled()
  })

  it("render props: should not call <Resolved>'s `children` function if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const children = jest.fn(() => void 0)
    mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    expect(children).not.toHaveBeenCalled()
    done()
  })

  it("render props: should call <Resolved>'s `children` function if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(() => <div>ABCDEF</div>)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(children).toHaveBeenCalledWith({ result: 42 })
    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).not.toBeEmptyRender()
    expect(resolvedContainer).toHaveText('ABCDEF')

    done()
  })

  it("render props: should not call <Resolved>'s `children` function if promise has not been resolved the second time", async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(result => null)
    const container = mount(
      <AsyncCall params="first">
        <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    container.instance().execute()
    expect(children).toHaveBeenCalledTimes(1)

    done()
  })

  it("should not render <Resolved>'s children if promise has not been resolved yet", () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).toBeEmptyRender()
  })

  it("should not render <Resolved>'s children if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()

    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).toBeEmptyRender()

    done()
  })

  it("should render <Resolved>'s empty children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved />
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).toBeEmptyRender()

    done()
  })

  it("should render <Resolved>'s children if promise has been resolved", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Resolved>
          <div>abcdef</div>
        </AsyncCall.Resolved>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).not.toBeEmptyRender()
    expect(resolvedContainer).toHaveText('abcdef')

    done()
  })

  it("should render <Resolved>'s children array if promise has been resolved", async done => {
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

    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer.children().length).toBe(2)
    expect(resolvedContainer.childAt(0)).toHaveText('abcdef')
    expect(resolvedContainer.childAt(1)).toHaveText('qwerty')

    done()
  })

  it("should not render <Resolved>'s children if promise has not been resolved the second time", async done => {
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
    const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
    expect(resolvedContainer).toExist()
    expect(resolvedContainer).toBeEmptyRender()

    done()
  })

  const values = [false, null, undefined]
  values.forEach(value =>
    it(`should render <Resolved>'s \`children\` function that returns ${value} if promise has been resolved`, async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>{() => value}</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      const resolvedContainer = getChildrenContainer(container, AsyncCall.Resolved)
      expect(resolvedContainer).toExist()
      expect(resolvedContainer).toBeEmptyRender()

      done()
    }),
  )

  it('should not clash nested <AsyncCall> components', async done => {
    const FirstAsyncCall = createAsyncCallComponent(() => Promise.resolve('first'))
    const SecondAsyncCall = createAsyncCallComponent(() => Promise.resolve('second'))
    const secondAsyncCall = mount(
      <SecondAsyncCall params={{}}>
        <FirstAsyncCall params={{}}>
          <FirstAsyncCall.Resolved>
            <div>first</div>
          </FirstAsyncCall.Resolved>
          <SecondAsyncCall.Resolved>
            <div>second</div>
          </SecondAsyncCall.Resolved>
        </FirstAsyncCall>
      </SecondAsyncCall>,
    )

    expect(secondAsyncCall).toBeDefined()
    await flushPromises()
    secondAsyncCall.update()

    const firstAsyncCall = getAsyncCallChildrenContainer(secondAsyncCall.find(FirstAsyncCall))
    expect(firstAsyncCall.children().length).toBe(2)
    expect(firstAsyncCall.childAt(0)).toHaveText('first')
    expect(firstAsyncCall.childAt(1)).toHaveText('second')

    done()
  })
})
