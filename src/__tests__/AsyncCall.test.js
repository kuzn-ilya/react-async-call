import * as React from 'react'
import * as PropTypes from 'prop-types'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { flushPromises } from './common'

describe('AsyncCall', () => {
  it('should throw an error if a function is not passed to createAsyncCallComponent', () => {
    const AsyncCall = createAsyncCallComponent(undefined)

    expect(() => shallow(<AsyncCall params={{}} />)).toThrow(
      'Function should be passed to createAsyncCallComponent as a first argument but got undefined.',
    )
  })

  it('should return a component class with static component classes', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall).toBeDefined()
  })

  it('should expose default display names', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.displayName).toBe('AsyncCall')
  })

  it('should call function passed to createAsyncCallComponent on mount', () => {
    const fn = jest.fn(() => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)

    shallow(<AsyncCall params={{}} />)

    expect(fn).toHaveBeenCalled()
  })

  it('should transfer params property as a function argument on mount', () => {
    const fn = jest.fn(value => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)

    shallow(<AsyncCall params="abcdef" />)

    expect(fn).toHaveBeenLastCalledWith('abcdef')
  })

  it('should be called once if params property was not changed', () => {
    const fn = jest.fn(() => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)

    const container = shallow(<AsyncCall params={{}} />)
    expect(fn).toHaveBeenLastCalledWith({})

    container.setProps({ params: {} })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should be called twice if params property was changed', () => {
    const fn = jest.fn(value => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)

    const container = shallow(<AsyncCall params={'abc'} />)
    expect(fn).toHaveBeenLastCalledWith('abc')

    container.setProps({ params: 'bcd' })
    expect(fn).toHaveBeenLastCalledWith('bcd')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should call once even if params property references were changed but they are shallow equal', () => {
    const fn = jest.fn(value => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)
    const container = shallow(<AsyncCall params={{ a: 1 }} />)
    container.setProps({ params: { a: 1 } })

    expect(fn).toHaveBeenCalledWith({ a: 1 })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if fn does not return promise', () => {
    const AsyncCall = createAsyncCallComponent(() => void 0)
    expect(() => shallow(<AsyncCall params={{}} />)).toThrow(
      'Function supplied to "createAsyncCallComponent" function should return a promise.',
    )
  })

  it('should expose execute method via ref', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(null))
    const container = shallow(<AsyncCall params={{}} />)
    expect(container.instance().execute).toBeFunction()
  })

  it('should be called twice if "execute" function is called explicitly', () => {
    const fn = jest.fn(() => Promise.resolve())
    const AsyncCall = createAsyncCallComponent(fn)
    const container = shallow(<AsyncCall params={{}} />)
    container.instance().execute()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should call children fn and pass { running: true, rejected: false, execute: <fn> } as an argument to it if promise has not been resolved yet', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{}}>{children}</AsyncCall>)

    expect(children).toHaveBeenLastCalledWith({
      running: true,
      resolved: false,
      rejected: false,
      execute: container.instance().execute,
    })
  })

  it('should call children fn and pass { running: false, result: 42, rejected: false } as an argument to it if promise has been resolved', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{}}>{children}</AsyncCall>)

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

  it("should call children fn and pass { running: false, rejected: true, rejectReason: 'rejected' } as an arguments to it if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{}}>{children}</AsyncCall>)

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

  it('should render children as is if children property is not a function', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = shallow(<AsyncCall params={{}}>abcdef</AsyncCall>)
    expect(container.text()).toBe('abcdef')
  })

  it('should render children as is if children property is array', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const container = mount(
      <AsyncCall params={{}}>
        <div>abcdef</div>
        <div>12345</div>
      </AsyncCall>,
    )
    expect(container.children().length).toBe(2)
    expect(container.childAt(0).text()).toBe('abcdef')
    expect(container.childAt(1).text()).toBe('12345')
  })

  it('should call children fn and pass { running: true, rejected: false, rejectedResult: undefined } as an arguments to it if promise has been called the second time after rejection', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{ a: 1 }}>{children}</AsyncCall>)

    await flushPromises()
    container.setProps({ params: { a: 2 } })

    expect(children).toHaveBeenLastCalledWith({
      running: true,
      rejected: false,
      resolved: false,
      rejectReason: undefined,
      execute: container.instance().execute,
    })

    done()
  })

  describe('context', () => {
    let rootContext
    let contextPropName
    const ContextChecker = (props, context) => {
      rootContext = context[contextPropName]
      return null
    }

    const prepareContextChecker = parent => {
      contextPropName = parent.contextPropName
      ContextChecker.contextTypes = {
        [contextPropName]: PropTypes.shape({}),
      }
    }

    afterEach(() => {
      rootContext = undefined
      contextPropName = undefined
    })

    it("should pass it's state to child context", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      prepareContextChecker(AsyncCall)

      const container = mount(
        <AsyncCall params={0}>
          <ContextChecker />
        </AsyncCall>,
      )
      expect(rootContext).toBeDefined()
      expect(rootContext).toHaveProperty('running')
      expect(rootContext).toHaveProperty('rejected')
      expect(rootContext).toHaveProperty('resolved')
      expect(rootContext).toHaveProperty('execute')
      expect(rootContext).not.toHaveProperty('rejectReason')
      expect(rootContext).not.toHaveProperty('result')
    })

    it('should pass appropriate properties to child context on the first run', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      prepareContextChecker(AsyncCall)

      const container = mount(
        <AsyncCall params={0}>
          <ContextChecker />
        </AsyncCall>,
      )
      expect(rootContext.running).toBe(true)
      expect(rootContext.rejected).toBe(false)
      expect(rootContext.resolved).toBe(false)
      expect(rootContext.execute).toBe(container.instance().execute)
      expect(rootContext).not.toHaveProperty('rejectReason')
      expect(rootContext).not.toHaveProperty('result')
    })

    it('should pass appropriate properties to child context on promise resolve', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
      prepareContextChecker(AsyncCall)

      const container = mount(
        <AsyncCall params={{}}>
          <ContextChecker />
        </AsyncCall>,
      )

      await flushPromises()

      expect(rootContext.running).toBe(false)
      expect(rootContext.rejected).toBe(false)
      expect(rootContext.resolved).toBe(true)
      expect(rootContext.execute).toBe(container.instance().execute)
      expect(rootContext).not.toHaveProperty('rejectReason')
      expect(rootContext.result).toBe(42)

      done()
    })

    it('should pass appropriate properties to child context on promise rejection', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
      prepareContextChecker(AsyncCall)
      const container = mount(
        <AsyncCall params={{}}>
          <ContextChecker />
        </AsyncCall>,
      )

      await flushPromises()

      expect(rootContext.running).toBe(false)
      expect(rootContext.rejected).toBe(true)
      expect(rootContext.resolved).toBe(false)
      expect(rootContext.execute).toBe(container.instance().execute)
      expect(rootContext.rejectReason).toBe('rejected')
      expect(rootContext).not.toHaveProperty('result')

      done()
    })

    it('should pass appropriate properties to child context on second run', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      prepareContextChecker(AsyncCall)
      const container = mount(
        <AsyncCall params="first">
          <ContextChecker />
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: 'second' })

      expect(rootContext.running).toBe(true)
      expect(rootContext.rejected).toBe(false)
      expect(rootContext.resolved).toBe(false)
      expect(rootContext.execute).toBe(container.instance().execute)
      expect(rootContext).not.toHaveProperty('result')
      expect(rootContext).not.toHaveProperty('rejectReason')

      done()
    })

    it('should pass appropriate properties to child context on second run after rejection', async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
      prepareContextChecker(AsyncCall)
      const container = mount(
        <AsyncCall params={{ a: 1 }}>
          <ContextChecker />
        </AsyncCall>,
      )

      await flushPromises()
      container.setProps({ params: { a: 2 } })

      expect(rootContext.running).toBe(true)
      expect(rootContext.rejected).toBe(false)
      expect(rootContext.resolved).toBe(false)
      expect(rootContext.execute).toBe(container.instance().execute)
      expect(rootContext).not.toHaveProperty('result')
      expect(rootContext).not.toHaveProperty('rejectReason')

      done()
    })
  })
})
