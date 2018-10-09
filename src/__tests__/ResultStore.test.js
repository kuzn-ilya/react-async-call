import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { resultStoreContextPropName, resultStoreContextPropType } from '../common'
import { flushPromises } from './common'

describe('<ResultStore>', () => {
  let spyOnConsoleError

  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => jest.resetAllMocks())

  it('should throw an error if <ResultStore> component is rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.ResultStore>{result => null}</AsyncCall.ResultStore>)).toThrow(
      '<AsyncCall.ResultStore> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  it('should throw an error if `children` property is not set', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    mount(
      <AsyncCall params="first">
        <AsyncCall.ResultStore />
      </AsyncCall>,
    )

    expect(spyOnConsoleError).toHaveBeenCalled()
    expect(spyOnConsoleError.mock.calls[0][0]).toContain(
      'The prop `children` is marked as required in `AsyncCall.ResultStore`, but its value is `undefined`',
    )
  })
})

describe('<ResultStore>', () => {
  let spyOnConsoleError
  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error')
  })

  afterEach(() => {
    expect(spyOnConsoleError).not.toHaveBeenCalled()
    jest.resetAllMocks()
  })

  it('should be exposed as a static prop from <AsyncCall>', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.ResultStore).toBeDefined()
  })

  it('should expose default display name', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.ResultStore.displayName).toBe('AsyncCall.ResultStore')
  })

  it('should render child "as is" if child is not a function', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>
          <div>ABC</div>
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()
    expect(resultStoreContainer).not.toBeEmptyRender()
    expect(resultStoreContainer).toHaveText('ABC')
  })

  it('render props: should call `children` and pass { hasResult: false } if promise has not been resolved yet', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()

    expect(children).toHaveBeenCalledWith({ hasResult: false, reset: resultStoreContainer.instance().reset })
  })

  it('render props: should call `children` and pass { hasResult: false } if promise has been rejected', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()

    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()

    expect(children).toHaveBeenCalledWith({ hasResult: false, reset: resultStoreContainer.instance().reset })

    done()
  })

  it('render props: should call `children` and render its result if promise has been resolved', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(({ result }) => <div>{result}</div>)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)

    await flushPromises()
    container.update()

    expect(children).toHaveBeenLastCalledWith({
      hasResult: true,
      result: 42,
      reset: resultStoreContainer.instance().reset,
    })

    expect(resultStoreContainer).toExist()
    expect(resultStoreContainer).not.toBeEmptyRender()
    expect(resultStoreContainer).toHaveText('42')

    done()
  })

  it('should not call `reduce` if promise has been resolved the first time', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const reduce = jest.fn(() => void 0)
    mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore reduce={reduce}>{({ result }) => <div>{result}</div>}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()
    expect(reduce).not.toHaveBeenCalled()

    done()
  })

  it('should call `reduce` if promise has been resolved the second time', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const reduce = jest.fn(() => void 0)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore reduce={reduce}>{({ result }) => <div>{result}</div>}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()
    container.setProps({ params: 2 })
    await flushPromises()
    container.update()

    expect(reduce).toHaveBeenCalledTimes(1)
    expect(reduce).toHaveBeenCalledWith(1, 2)

    done()
  })

  it('should call `reduce` and pass returning value of `reduce` to a `children` function', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(({ result }) => <div>{result}</div>)
    const container = mount(
      <AsyncCall params={10}>
        <AsyncCall.ResultStore reduce={(prevResult, currentResult) => prevResult + currentResult}>
          {children}
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)

    await flushPromises()
    container.setProps({ params: 32 })

    await flushPromises()
    expect(children).toHaveBeenLastCalledWith({
      hasResult: true,
      result: 42,
      reset: resultStoreContainer.instance().reset,
    })

    done()
  })

  it('should not call `reduce` if promise has not been resolved yet', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const reduce = jest.fn(() => void 0)
    mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore reduce={reduce}>{() => null}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    expect(reduce).not.toHaveBeenCalled()
  })

  it('should not call `reduce` if promise has been resolved only once', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const reduce = jest.fn(() => void 0)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore reduce={reduce}>{() => null}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(reduce).not.toHaveBeenCalled()

    done()
  })

  it('should call `reduce` once promise has been resolved twice', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const reduce = jest.fn(() => void 0)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore reduce={reduce}>{() => null}</AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(reduce).not.toHaveBeenCalled()

    container.setProps({ params: 2 })
    await flushPromises()
    container.update()

    expect(reduce).toHaveBeenCalledWith(1, 2)
    done()
  })

  it('should pass different results of promise resolving to `children` function if `reduce` property is not set and promise has been resolved twice', async done => {
    const children = jest.fn(({ result }) => <div>{result}</div>)
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)

    await flushPromises()
    container.update()
    expect(children).toHaveBeenCalledWith({
      result: 1,
      hasResult: true,
      reset: resultStoreContainer.instance().reset,
    })

    container.setProps({ params: 2 })
    await flushPromises()
    container.update()
    expect(children).toHaveBeenCalledWith({
      result: 2,
      hasResult: true,
      reset: resultStoreContainer.instance().reset,
    })

    done()
  })

  it('should reset result if `result` property is set', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(<AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>, {
      context: { [AsyncCall.contextPropName]: { resolved: true, result: 1 } },
    })

    expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 1, reset: container.instance().reset })

    container.setProps({ reset: true })
    container.setContext({ [AsyncCall.contextPropName]: { resolved: false } })
    container.update()
    expect(children).toHaveBeenLastCalledWith({ hasResult: false, reset: container.instance().reset })

    container.setProps({ reset: false })
    container.setContext({ [AsyncCall.contextPropName]: { resolved: true, result: 2 } })
    container.update()
    expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 2, reset: container.instance().reset })

    done()
  })

  it('should pass `initialValue` property value to result when component is mounted', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(<AsyncCall.ResultStore initialValue={100500}>{children}</AsyncCall.ResultStore>, {
      context: { [AsyncCall.contextPropName]: { resolved: false } },
    })

    expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 100500, reset: container.instance().reset })
  })

  describe('child context', () => {
    let rootContext
    let contextPropName
    const ContextChecker = (props, context) => {
      rootContext = context[contextPropName]
      return null
    }

    const prepareContextChecker = parent => {
      contextPropName = parent.ResultStore.contextPropName
      ContextChecker.contextTypes = {
        [contextPropName]: resultStoreContextPropType,
      }
    }

    afterEach(() => {
      rootContext = undefined
      contextPropName = undefined
    })

    it("should pass component's state to child context", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      prepareContextChecker(AsyncCall)

      mount(
        <AsyncCall params={0}>
          <AsyncCall.ResultStore>
            <ContextChecker />
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )
      expect(rootContext).toBeDefined()
      expect(rootContext.hasResult).toBe(false)
      expect(rootContext).not.toHaveProperty('result')
    })

    it('should pass result to child context if promise has been resolved', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
      prepareContextChecker(AsyncCall)

      mount(
        <AsyncCall params={0}>
          <AsyncCall.ResultStore reduce={() => void 0}>
            <ContextChecker />
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )

      await flushPromises()
      expect(rootContext).toBeDefined()
      expect(rootContext.hasResult).toBe(true)
      expect(rootContext.result).toBe(42)

      done()
    })
  })

  it('should expose `reset` method via ref', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(null))
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore />
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    expect(resultStoreContainer.instance().reset).toBeFunction()
  })

  it('should reset result', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)

    await flushPromises()
    expect(children).toHaveBeenLastCalledWith({
      hasResult: true,
      result: 1,
      reset: resultStoreContainer.instance().reset,
    })

    resultStoreContainer.instance().reset(false)
    await flushPromises()

    expect(children).toHaveBeenLastCalledWith({ hasResult: false, reset: resultStoreContainer.instance().reset })

    done()
  })

  it('should reset result to `initialValue` if it is set ', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore initialValue={'intitalValue'}>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const resultStoreContainer = container.find(AsyncCall.ResultStore)

    await flushPromises()
    expect(children).toHaveBeenLastCalledWith({
      hasResult: true,
      result: 1,
      reset: resultStoreContainer.instance().reset,
    })

    resultStoreContainer.instance().reset(false)
    await flushPromises()

    expect(children).toHaveBeenLastCalledWith({
      hasResult: true,
      result: 'intitalValue',
      reset: resultStoreContainer.instance().reset,
    })

    done()
  })

  it('should call `execute` method if no arguments is passed to `reset` method', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const spyOnExecute = jest.spyOn(container.instance(), 'execute')
    container.update()
    await flushPromises()

    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    resultStoreContainer.instance().reset()
    await flushPromises()

    expect(spyOnExecute).toHaveBeenCalled()

    done()
  })

  it('should not call `execute` method if `false` is passed to `reset` method', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={1}>
        <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
      </AsyncCall>,
    )
    const spyOnExecute = jest.spyOn(container.instance(), 'execute')
    container.update()
    await flushPromises()

    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    resultStoreContainer.instance().reset(false)
    await flushPromises()

    expect(spyOnExecute).not.toHaveBeenCalled()

    done()
  })
})
