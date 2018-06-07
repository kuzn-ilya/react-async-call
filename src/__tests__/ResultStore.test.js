import * as React from 'react'
import * as PropTypes from 'prop-types'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { resultStoreContextPropName, resultStoreContextPropType } from '../common'
import { flushPromises } from './common'

describe('ResultStore', () => {
  describe('invariants', () => {
    it('should be exposed as static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.ResultStore).toBeDefined()
    })

    it('should expose default display names', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.ResultStore.displayName).toBe('AsyncCall.ResultStore')
    })

    it('should throw an error if ResultStore component rendered alone', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(() => shallow(<AsyncCall.ResultStore>{result => null}</AsyncCall.ResultStore>)).toThrow(
        '<AsyncCall.ResultStore> must be a child (direct or indirect) of <AsyncCall>.',
      )
    })

    it('should throw an error if children is not passed', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      mount(
        <AsyncCall params="first">
          <AsyncCall.ResultStore />
        </AsyncCall>,
      )

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('children', () => {
    it('should render child "as is" if it is not a function', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore>
            <div>ABC</div>
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )

      expect(container.children().exists()).toBe(true)
      const resultStoreContainer = container.childAt(0)
      expect(resultStoreContainer).toBeDefined()
      expect(resultStoreContainer).not.toBeEmptyRender()
      expect(resultStoreContainer.children().length).toBe(1)
      expect(resultStoreContainer.childAt(0).text()).toBe('ABC')
    })
  })

  describe('render props', () => {
    it('should call children fn passing { hasResult: false } to it if promise has not been resolved yet', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
        </AsyncCall>,
      )

      expect(container.children().exists()).toBe(true)
      const resultStoreContainer = container.childAt(0)
      expect(resultStoreContainer).toBeDefined()
      expect(resultStoreContainer).toBeEmptyRender()

      expect(children).toHaveBeenCalledWith({ hasResult: false })
    })

    it('should call children fn passing { hasResult: false } to it if promise has been rejected', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
        </AsyncCall>,
      )

      await flushPromises()

      expect(container.children().exists()).toBe(true)
      const resultStoreContainer = container.childAt(0)
      expect(resultStoreContainer).toBeDefined()
      expect(resultStoreContainer).toBeEmptyRender()

      expect(children).toHaveBeenCalledWith({ hasResult: false })

      done()
    })

    it('should call children fn and render its result if promise has been resolved', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
      const children = jest.fn(({ result }) => <div>{result}</div>)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 42 })

      expect(container.children().exists()).toBe(true)
      const resultStoreContainer = container.childAt(0)
      expect(resultStoreContainer).toBeDefined()
      expect(resultStoreContainer).not.toBeEmptyRender()
      expect(resultStoreContainer.children().exists()).toBe(true)
      expect(resultStoreContainer.childAt(0).text()).toBe('42')

      done()
    })
  })

  describe('reduce', () => {
    it("should not call 'reduce' if promise has been called the first time", async done => {
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

    it("should call 'reduce' if promise has been called the second time", async done => {
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

    it("should call 'reduce' and pass returning value of 'reduce' to a children function", async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const children = jest.fn(({ result }) => <div>{result}</div>)
      const container = mount(
        <AsyncCall params={10}>
          <AsyncCall.ResultStore reduce={(prevResult, currentResult) => prevResult + currentResult}>
            {children}
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: 32 })

      await flushPromises()
      expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 42 })

      done()
    })

    it("should not call 'reduce' if promise has not been resolved yet", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const reduce = jest.fn(() => void 0)
      mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore reduce={reduce}>{() => null}</AsyncCall.ResultStore>
        </AsyncCall>,
      )
      expect(reduce).not.toHaveBeenCalled()
    })

    it("should not call 'reduce' if promise has been resolved only once", async done => {
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

    it("should call 'reduce' once if promise has been resolved twice", async done => {
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

    it('should pass result twice if promise has been resolved twice but no reduce callback was supplied', async done => {
      const children = jest.fn(({ result }) => <div>{result}</div>)
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const container = mount(
        <AsyncCall params={1}>
          <AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()
      expect(children).toHaveBeenCalledWith({ result: 1, hasResult: true })

      container.setProps({ params: 2 })
      await flushPromises()
      container.update()
      expect(children).toHaveBeenCalledWith({ result: 2, hasResult: true })

      done()
    })
  })

  describe('reset', () => {
    it('should reset result', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const children = jest.fn(() => null)
      const container = mount(<AsyncCall.ResultStore>{children}</AsyncCall.ResultStore>, {
        context: { [AsyncCall.contextPropName]: { resolved: true, result: 1 } },
      })

      expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 1 })

      container.setProps({ reset: true })
      container.setContext({ [AsyncCall.contextPropName]: { resolved: false } })
      container.update()
      expect(children).toHaveBeenLastCalledWith({ hasResult: false })

      container.setProps({ reset: false })
      container.setContext({ [AsyncCall.contextPropName]: { resolved: true, result: 2 } })
      container.update()
      expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 2 })

      done()
    })
  })

  describe('initialValue', () => {
    it("should pass 'initialValue' to result", () => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const children = jest.fn(() => null)
      mount(<AsyncCall.ResultStore initialValue={100500}>{children}</AsyncCall.ResultStore>, {
        context: { [AsyncCall.contextPropName]: { resolved: false } },
      })

      expect(children).toHaveBeenLastCalledWith({ hasResult: true, result: 100500 })
    })
  })

  describe('child context', () => {
    let rootContext
    let contextPropName
    const ContextChecker = (props, context) => {
      rootContext = context[contextPropName][resultStoreContextPropName]
      return null
    }

    const prepareContextChecker = parent => {
      contextPropName = parent.contextPropName
      ContextChecker.contextTypes = {
        [parent.contextPropName]: resultStoreContextPropType,
      }
    }

    afterEach(() => {
      rootContext = undefined
      contextPropName = undefined
    })

    it("should pass it's state to child context", () => {
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

    it('should pass result to child context if promise was resolved', async done => {
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
})
