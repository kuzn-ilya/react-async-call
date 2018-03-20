import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

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
    expect(AsyncCall).toBeReactComponent()
    expect(AsyncCall.Running).toBeDefined()
    expect(AsyncCall.Resolved).toBeDefined()
    expect(AsyncCall.Rejected).toBeDefined()
    expect(AsyncCall.Executor).toBeDefined()
    expect(AsyncCall.HasResult).toBeDefined()
    expect(AsyncCall.State).toBeDefined()
  })

  it('should expose default display names', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())

    expect(AsyncCall.displayName).toBe('AsyncCall')
    expect(AsyncCall.Running.displayName).toBe('AsyncCall.Running')
    expect(AsyncCall.Resolved.displayName).toBe('AsyncCall.Resolved')
    expect(AsyncCall.Rejected.displayName).toBe('AsyncCall.Rejected')
    expect(AsyncCall.Executor.displayName).toBe('AsyncCall.Executor')
    expect(AsyncCall.HasResult.displayName).toBe('AsyncCall.HasResult')
    expect(AsyncCall.State.displayName).toBe('AsyncCall.State')
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
      hasResult: false,
      execute: container.instance().execute,
    })
  })

  it('should call children fn and pass { running: false, result: 42, rejected: false } as an argument to it if promise has been resolved', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{}}>{children}</AsyncCall>)

    expect(children).toHaveBeenLastCalledWith({
      running: true,
      resolved: false,
      rejected: false,
      hasResult: false,
      execute: container.instance().execute,
    })

    await flushPromises()

    expect(children).toHaveBeenLastCalledWith({
      running: false,
      resolved: true,
      result: 42,
      rejected: false,
      hasResult: true,
      execute: container.instance().execute,
    })

    done()
  })

  it("should call children fn and pass { running: false, rejected: true, rejectReason: 'rejected' } as an arguments to it if promise has been rejected", async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params={{}}>{children}</AsyncCall>)

    expect(children).toHaveBeenLastCalledWith({
      running: true,
      rejected: false,
      resolved: false,
      hasResult: false,
      execute: container.instance().execute,
    })

    await flushPromises()

    expect(children).toHaveBeenLastCalledWith({
      running: false,
      rejected: true,
      resolved: false,
      rejectReason: 'rejected',
      hasResult: false,
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

  it('should call children fn and pass { running: true, rejected: false, result: <previous result> } as an arguments to it if promise has been called the second time after resolving', async done => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(() => null)
    const container = shallow(<AsyncCall params="first">{children}</AsyncCall>)

    await flushPromises()
    container.setProps({ params: 'second' })

    expect(children).toHaveBeenLastCalledWith({
      running: true,
      rejected: false,
      resolved: false,
      result: 'first',
      hasResult: true,
      execute: container.instance().execute,
    })

    done()
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
      hasResult: false,
      execute: container.instance().execute,
    })

    done()
  })

  describe('mergeResult', () => {
    it('should not call mergeResult callback if promise has been called the first time', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve())
      const mergeResult = jest.fn(() => void 0)
      const container = shallow(<AsyncCall params={0} mergeResult={mergeResult} />)
      await flushPromises()

      expect(mergeResult).not.toHaveBeenCalled()

      done()
    })

    it('should call mergeResult callback if promise has been called the second time', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const mergeResult = jest.fn((prevResult, currentResult) => void 0)
      const container = shallow(<AsyncCall params={0} mergeResult={mergeResult} />)

      container.setProps({ params: 1 })

      await flushPromises()

      expect(mergeResult).toHaveBeenCalledTimes(1)
      expect(mergeResult).toHaveBeenCalledWith(0, 1)

      done()
    })

    it('should pass returning value of mergeResult callback to a children function', async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const mergeResult = (prevResult, currentResult) => prevResult + currentResult
      const children = jest.fn(result => null)
      const container = shallow(
        <AsyncCall params={10} mergeResult={mergeResult}>
          {({ result }) => children(result)}
        </AsyncCall>,
      )

      container.setProps({ params: 32 })

      await flushPromises()
      expect(children).toHaveBeenLastCalledWith(42)

      done()
    })
  })
})
