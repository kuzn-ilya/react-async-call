import * as React from 'react'
import * as PropTypes from 'prop-types'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../'
import { getAsyncCallChildrenContainer, flushPromises } from './common'

describe('AsyncCall', () => {
  describe('invariants', () => {
    it('should throw an error if a function is not passed to createAsyncCallComponent', () => {
      const AsyncCall = createAsyncCallComponent(undefined)

      expect(() => shallow(<AsyncCall params={{}} />)).toThrow(
        'Function should be passed to createAsyncCallComponent as a first argument but got undefined.',
      )
    })

    it('should return a component class', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.displayName).toBe('AsyncCall')
    })
  })

  describe('promise-returning fn', () => {
    it('should be called on mount', () => {
      const fn = jest.fn(() => Promise.resolve())
      const AsyncCall = createAsyncCallComponent(fn)

      shallow(<AsyncCall params={{}} />)

      expect(fn).toHaveBeenCalled()
    })

    it('should pass params property to a function as an argument on mount', () => {
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

      const container = shallow(<AsyncCall params="abc" />)
      expect(fn).toHaveBeenLastCalledWith('abc')

      container.setProps({ params: 'bcd' })
      expect(fn).toHaveBeenLastCalledWith('bcd')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should be called once even if params property references were changed but they are shallow equal', () => {
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
  })

  describe('execute', () => {
    it('should expose execute method via ref', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(null))
      const container = shallow(<AsyncCall params={{}} />)
      expect(container.instance().execute).toBeFunction()
    })

    it('should call promise-returning fn twice if "execute" function is called explicitly', () => {
      const fn = jest.fn(() => Promise.resolve())
      const AsyncCall = createAsyncCallComponent(fn)
      const container = shallow(<AsyncCall params={{}} />)
      container.instance().execute()
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should pass params to a promise-returning fn if "execute" function is called explicitly', () => {
      const fn = jest.fn(value => Promise.resolve(value))
      const AsyncCall = createAsyncCallComponent(fn)
      const container = shallow(<AsyncCall params={42} />)
      container.instance().execute()
      expect(fn).toHaveBeenLastCalledWith(42)
    })
  })

  describe('render props', () => {
    describe('should call children fn', () => {
      it('and pass { running: true, resolved: false, rejected: false, execute: <fn> } as an argument to it if promise has not been resolved yet', () => {
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

      it('and pass { running: false, resolved: true, result: 42, rejected: false } as an argument to it if promise has been resolved', async done => {
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

      it("and pass { running: false, resolved: false, rejected: true, rejectReason: 'rejected' } as an arguments to it if promise has been rejected", async done => {
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

      it('and pass { running: true, resolved: false, rejected: false } as an arguments to it if promise has been called the second time after rejection', async done => {
        const AsyncCall = createAsyncCallComponent(() => Promise.reject('rejected'))
        const children = jest.fn(() => null)
        const container = shallow(<AsyncCall params={{ a: 1 }}>{children}</AsyncCall>)

        await flushPromises()
        container.setProps({ params: { a: 2 } })

        expect(children).toHaveBeenLastCalledWith({
          running: true,
          rejected: false,
          resolved: false,
          execute: container.instance().execute,
        })

        done()
      })
    })
  })

  describe('children', () => {
    it('should render children as is if children property is not a function', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = getAsyncCallChildrenContainer(shallow(<AsyncCall params={{}}>abcdef</AsyncCall>))
      expect(container).toHaveText('abcdef')
    })

    it('should render children as is if children property is array', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = getAsyncCallChildrenContainer(
        mount(
          <AsyncCall params={{}}>
            <div>abcdef</div>
            <div>12345</div>
          </AsyncCall>,
        ),
      )
      expect(container.children().length).toBe(2)
      expect(container.childAt(0)).toHaveText('abcdef')
      expect(container.childAt(1)).toHaveText('12345')
    })
  })

  describe('unmount', () => {
    it('should not throw an error when component is unmounted during resolving', async done => {
      const fn = jest.fn(() => Promise.resolve())
      const AsyncCall = createAsyncCallComponent(fn)

      const container = shallow(<AsyncCall params={{}} />)
      container.unmount()

      await flushPromises()

      done()
    })

    it('should not throw an error when component is unmounted during rejection', async done => {
      const fn = jest.fn(() => Promise.reject())
      const AsyncCall = createAsyncCallComponent(fn)

      const container = shallow(<AsyncCall params={{}} />)
      container.unmount()

      await flushPromises()

      done()
    })
  })

  describe('lazy', () => {
    describe('should not call a function passed to createAsyncCallComponent', () => {
      it('on mount', () => {
        const fn = jest.fn(() => Promise.resolve())
        const AsyncCall = createAsyncCallComponent(fn)

        shallow(<AsyncCall lazy params={{}} />)

        expect(fn).not.toHaveBeenCalled()
      })

      it('if params property was not changed', () => {
        const fn = jest.fn(() => Promise.resolve())
        const AsyncCall = createAsyncCallComponent(fn)

        const container = shallow(<AsyncCall lazy params={{}} />)
        container.setProps({ params: {} })

        expect(fn).not.toHaveBeenCalled()
      })

      it('if params property was changed', () => {
        const fn = jest.fn(value => Promise.resolve())
        const AsyncCall = createAsyncCallComponent(fn)

        const container = shallow(<AsyncCall lazy params={'abc'} />)

        container.setProps({ params: 'bcd' })
        expect(fn).not.toHaveBeenCalled()
      })

      it('if params property references were changed but they are shallow equal', () => {
        const fn = jest.fn(value => Promise.resolve())
        const AsyncCall = createAsyncCallComponent(fn)
        const container = shallow(<AsyncCall lazy params={{ a: 1 }} />)
        container.setProps({ params: { a: 1 } })

        expect(fn).not.toHaveBeenCalled()
      })
    })
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

    it('should pass its state to a child context', () => {
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

    it('should pass appropriate properties to a child context on the first run', () => {
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

    it('should pass appropriate properties to a child context on promise resolve', async done => {
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

    it('should pass appropriate properties to a child context on promise rejection', async done => {
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

    it('should pass appropriate properties to a child context on second run', async done => {
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

    it('should pass appropriate properties to a child context on second run after rejection', async done => {
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
