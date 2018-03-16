import * as React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import createPromiseRenderer from '../index'

Enzyme.configure({ adapter: new Adapter() })

expect.extend({
  toBeReactComponent: received =>
    received.prototype.isReactComponent
      ? {
          message: () => `expected ${received} not to be a React component`,
          pass: true,
        }
      : {
          message: () => `expected ${received} to be a React component`,
          pass: false,
        },
  toHaveEmptyRender: received =>
    received.isEmptyRender()
      ? {
          message: () => `expected\n${received.debug()}\nnot to have an empty render`,
          pass: true,
        }
      : {
          message: () => `expected\n${received.debug()}\nto have an empty render`,
          pass: false,
        },
  toBeFunction: received =>
    received && received.constructor && received.call && received.apply
      ? {
          message: () => `expected ${received} not to be a function`,
          pass: true,
        }
      : {
          message: () => `expected ${received} to be a function`,
          pass: false,
        },
})

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

describe('react-promise-renderer', () => {
  let error
  beforeEach(() => {
    error = jest.spyOn(console, 'error')
  })

  afterEach(() => {
    expect(error).not.toHaveBeenCalled()
    error.mockReset()
    error.mockRestore()
  })

  describe('PromiseRenderer', () => {
    it('should throw an error if a function is not passed to createPromiseRenderer', () => {
      const PromiseRenderer = createPromiseRenderer(undefined)
      expect(() => shallow(<PromiseRenderer params={{}} />)).toThrow(
        'Function should be passed to createPromiseRenderer as a first argument but got undefined.',
      )
    })

    it('should return a component class with static Running and Resolved component classes', () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      expect(PromiseRenderer).toBeDefined()
      expect(PromiseRenderer).toBeReactComponent()
      expect(PromiseRenderer.Running).toBeDefined()
      expect(PromiseRenderer.Running).toBeReactComponent()
      expect(PromiseRenderer.Resolved).toBeDefined()
      expect(PromiseRenderer.Resolved).toBeReactComponent()
      expect(PromiseRenderer.Rejected).toBeDefined()
      expect(PromiseRenderer.Rejected).toBeReactComponent()
      expect(PromiseRenderer.Executor).toBeDefined()
      expect(PromiseRenderer.Executor).toBeReactComponent()
    })

    it('should call function passed to createPromiseRenderer on mount', () => {
      const fn = jest.fn(() => Promise.resolve())

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={{}} />)
      expect(container).toBeDefined()
      expect(fn).toHaveBeenCalled()
    })

    it('should transfer params property as a function argument on mount', () => {
      const fn = jest.fn(value => Promise.resolve())

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params="abcdef" />)
      expect(container).toBeDefined()
      expect(fn).toHaveBeenLastCalledWith('abcdef')
    })

    it('should be called once if params property was not changed', () => {
      const fn = jest.fn(() => Promise.resolve())

      const params = {}
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={params} />)
      expect(container).toBeDefined()

      container.setProps({ params })
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should be called twice if params property was changed', () => {
      const fn = jest.fn(value => Promise.resolve())
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={'abc'} />)
      expect(container).toBeDefined()

      expect(fn).toHaveBeenLastCalledWith('abc')

      container.setProps({ params: 'bcd' })
      expect(fn).toHaveBeenLastCalledWith('bcd')
    })

    it('should call once even if params property references were changed but they are shallow equal', () => {
      const fn = jest.fn(value => Promise.resolve())
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={{ a: 1 }} />)
      expect(container).toBeDefined()
      container.setProps({ params: { a: 1 } })
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if fn does not return promise', () => {
      const PromiseRenderer = createPromiseRenderer(() => void 0)
      expect(() => shallow(<PromiseRenderer params={{}} />)).toThrow(
        'Function supplied to "createPromiseRenderer" function should return a promise.',
      )
    })

    it('should expose execute method via ref', () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve(null))
      const container = shallow(<PromiseRenderer params={{}} />)
      expect(container).toBeDefined()

      expect(container.instance().execute).toBeFunction()
    })

    it('should be called twice if "execute" function is called explicitly', () => {
      const fn = jest.fn(() => Promise.resolve())
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={{}} />)

      expect(container).toBeDefined()
      container.instance().execute()
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should call children fn and pass { running: true, rejected: false, execute: <fn> } as an argument to it if promise has not been resolved yet', () => {
      const fn = () => Promise.resolve()
      const children = jest.fn(() => null)

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)
      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        execute: container.instance().execute,
      })
    })

    it('should call children fn and pass { running: false, result: 42, rejected: false } as an argument to it if promise has been resolved', async done => {
      const promise = Promise.resolve(42)
      const fn = () => promise

      const children = jest.fn(() => null)

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = shallow(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        execute: container.instance().execute,
      })

      await flushPromises()
      expect(children).toHaveBeenLastCalledWith({
        running: false,
        result: 42,
        rejected: false,
        execute: container.instance().execute,
      })
      done()
    })

    it("should call children fn and pass { running: false, rejected: true, rejectReason: 'rejected' } as an arguments to it if promise has been rejected", async done => {
      const promise = Promise.reject('rejected')
      const fn = () => promise

      const children = jest.fn(() => null)

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = mount(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        execute: container.instance().execute,
      })
      await flushPromises()
      expect(children).toHaveBeenLastCalledWith({
        running: false,
        rejected: true,
        rejectReason: 'rejected',
        execute: container.instance().execute,
      })
      done()
    })

    it('should render children as is if children property is not a function', () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = shallow(<PromiseRenderer params={{}}>abcdef</PromiseRenderer>)
      expect(container.text()).toBe('abcdef')
    })

    it('should render children as is if children property is array', () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = mount(
        <PromiseRenderer params={{}}>
          <div>abcdef</div>
          <div>12345</div>
        </PromiseRenderer>,
      )
      expect(container.children().length).toBe(2)
      expect(container.childAt(0).text()).toBe('abcdef')
      expect(container.childAt(1).text()).toBe('12345')
    })

    it('should call children fn and pass { running: true, rejected: false, result: <previous result> } as an arguments to it if promise has been called the second time after resolving', async done => {
      const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(value))
      const children = jest.fn(() => null)
      const container = mount(<PromiseRenderer params="first">{children}</PromiseRenderer>)

      await flushPromises()
      container.setProps({ params: 'second' })

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        result: 'first',
        execute: container.instance().execute,
      })
      done()
    })

    it('should call children fn and pass { running: true, rejected: false, rejectedResult: undefined } as an arguments to it if promise has been called the second time after rejection', async done => {
      const promise = Promise.reject('rejected')
      const fn = () => promise

      const children = jest.fn(() => null)

      const PromiseRenderer = createPromiseRenderer(fn)
      const container = mount(<PromiseRenderer params={{ a: 1 }}>{children}</PromiseRenderer>)

      await flushPromises()
      container.setProps({ params: { a: 2 } })

      expect(children).toHaveBeenLastCalledWith({
        running: true,
        rejected: false,
        rejectReason: undefined,
        execute: container.instance().execute,
      })
      done()
    })
  })

  describe('mergeResult', () => {
    it('should not call mergeResult callback if promise has been called the first time', async done => {
      const fn = value => Promise.resolve()
      const mergeResult = jest.fn(() => void 0)
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = mount(<PromiseRenderer params={0} mergeResult={mergeResult} />)
      await flushPromises()
      expect(mergeResult).not.toHaveBeenCalled()

      done()
    })

    it('should call mergeResult callback if promise has been called the second time', async done => {
      const fn = value => Promise.resolve(value)
      const mergeResult = jest.fn((prevResult, currentResult) => void 0)
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = mount(<PromiseRenderer params={0} mergeResult={mergeResult} />)

      container.setProps({ params: 1 })
      await flushPromises()
      expect(mergeResult).toHaveBeenCalledTimes(1)
      expect(mergeResult).toHaveBeenCalledWith(0, 1)

      done()
    })

    it('should pass returning value of mergeResult callback to a children function', async done => {
      const fn = value => Promise.resolve(value)
      const mergeResult = (prevResult, currentResult) => prevResult + currentResult
      const children = jest.fn(result => null)
      const PromiseRenderer = createPromiseRenderer(fn)
      const container = mount(
        <PromiseRenderer params={10} mergeResult={mergeResult}>
          {({ result }) => children(result)}
        </PromiseRenderer>,
      )

      container.setProps({ params: 32 })
      await flushPromises()
      expect(children).toHaveBeenLastCalledWith(42)

      done()
    })
  })

  describe('Running', () => {
    it("should render Running's children if promise has not been resolved yet", () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Running>abcdef</PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).not.toHaveEmptyRender()
      expect(runningContainer.text()).toBe('abcdef')
    })

    it("should render Running's children array if promise has not been resolved yet", () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Running>
            <div>abcdef</div>
            <div>bcdefg</div>
          </PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer.children().length).toBe(2)
      expect(runningContainer.childAt(0).text()).toBe('abcdef')
      expect(runningContainer.childAt(1).text()).toBe('bcdefg')
    })

    it("should not render Running's children if promise has been resolved", async done => {
      const promise = Promise.resolve()
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Running>abcdef</PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      container.update()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveEmptyRender()
      done()
    })

    it("should not render Running's children if promise has been resolved and returned truthy value", async done => {
      const promise = Promise.resolve('abcdef')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Running>abcdef</PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()

      container.update()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveEmptyRender()
      done()
    })

    it("should not render Running's children if promise has been rejected", async done => {
      const promise = Promise.reject('error')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Running>abcdef</PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      container.update()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const runningContainer = container.childAt(0)
      expect(runningContainer).toBeDefined()
      expect(runningContainer).toHaveEmptyRender()
      done()
    })

    it("should render Running's children whenever render-returning function is called second time", async done => {
      const PromiseRenderer = createPromiseRenderer(x => Promise.resolve('abcdef'))
      const container = mount(
        <PromiseRenderer params={1}>
          <PromiseRenderer.Running>abcdef</PromiseRenderer.Running>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
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
        expect(runningContainer.text()).toBe('abcdef')
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

  describe('Rejected', () => {
    it("should not render Rejected's children if promise has not been resolved yet", () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Rejected>abcdef</PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer).toHaveEmptyRender()
    })

    it("should not render Rejected's children if promise has been resolved", async done => {
      const promise = Promise.resolve()
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Rejected>abcdef</PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer).toHaveEmptyRender()
      done()
    })

    it("should render Rejected's children if promise has been rejected", async done => {
      const promise = Promise.reject('error')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Rejected>abcdef</PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      container.update()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer).not.toHaveEmptyRender()
      expect(rejectedContainer.text()).toBe('abcdef')
      done()
    })

    it("should render Rejected's children array if promise has been rejected", async done => {
      const promise = Promise.reject('error')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Rejected>
            <div>abcdef</div>
            <div>cdefgh</div>
          </PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()

      await flushPromises()
      container.update()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer.children().length).toBe(2)
      expect(rejectedContainer.childAt(0).text()).toBe('abcdef')
      expect(rejectedContainer.childAt(1).text()).toBe('cdefgh')
      done()
    })

    it("should call Rejected's children fn if promise has been rejected", async done => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.reject('error:'))
      const children = jest.fn(rejectReason => rejectReason + 'abcdef')
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Rejected>{children}</PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(children).not.toHaveBeenCalled()
      await flushPromises()
      expect(children).toHaveBeenCalledTimes(1)
      expect(children).toHaveBeenCalledWith('error:')

      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer.text()).toBe('error:abcdef')
      done()
    })

    it("should not render Rejected's children if promise has not been resolved the second time", async done => {
      const PromiseRenderer = createPromiseRenderer(value => Promise.reject(value))
      const children = jest.fn(result => result)
      const container = mount(
        <PromiseRenderer params="first">
          <PromiseRenderer.Rejected>{children}</PromiseRenderer.Rejected>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      container.update()

      container.setProps({ params: 'second' })
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer).toHaveEmptyRender()

      done()
    })
  })

  describe('Resolved', () => {
    it("should not render Resolved's children if promise has not been resolved yet", () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>abcdef</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toHaveEmptyRender()
    })

    it("should not render Resolved's children if promise has been rejected", async done => {
      const promise = Promise.reject('error')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>abcdef</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toHaveEmptyRender()
      done()
    })

    it("should render Resolved's children if promise has been resolved", async done => {
      const promise = Promise.resolve()
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>abcdef</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
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
      const promise = Promise.resolve()
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>
            <div>abcdef</div>
            <div>qwerty</div>
          </PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
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

    it("should not call Resolved's children fn if promise has not been resolved yet", () => {
      const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
      const children = jest.fn(result => null)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>{children}</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      expect(children).not.toHaveBeenCalled()
    })

    it("should call Resolved's children fn if promise has been resolved", async done => {
      const promise = Promise.resolve()
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const children = jest.fn(result => 'abcdef')
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>{children}</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer.text()).toBe('abcdef')
      done()
    })

    it("should pass promise resolve result to call Resolved's children fn if promise has been resolved", async done => {
      const promise = Promise.resolve('abcdef')
      const PromiseRenderer = createPromiseRenderer(() => promise)
      const children = jest.fn(result => null)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Resolved>{children}</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      expect(children).toHaveBeenCalledTimes(1)
      expect(children).toHaveBeenCalledWith('abcdef')
      done()
    })

    it('should not clash two promise renderers', async done => {
      const FirstPromiseRenderer = createPromiseRenderer(() => Promise.resolve('first'))
      const SecondPromiseRenderer = createPromiseRenderer(() => Promise.resolve('second'))
      const firstChild = jest.fn(result => 'abc')
      const secondChild = jest.fn(result => 'def')
      const container = mount(
        <SecondPromiseRenderer params={{}}>
          <FirstPromiseRenderer params={{}}>
            <FirstPromiseRenderer.Resolved>{firstChild}</FirstPromiseRenderer.Resolved>
            <SecondPromiseRenderer.Resolved>{secondChild}</SecondPromiseRenderer.Resolved>
          </FirstPromiseRenderer>
        </SecondPromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      expect(firstChild).toHaveBeenCalledTimes(1)
      expect(firstChild).toHaveBeenCalledWith('first')
      expect(secondChild).toHaveBeenCalledTimes(1)
      expect(secondChild).toHaveBeenCalledWith('second')
      done()
    })

    it("should not render Resolved's children if promise has not been resolved the second time", async done => {
      const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(value))
      const children = jest.fn(result => <div>{result}</div>)
      const container = mount(
        <PromiseRenderer params="first">
          <PromiseRenderer.Resolved>{children}</PromiseRenderer.Resolved>
        </PromiseRenderer>,
      )

      expect(container).toBeDefined()
      await flushPromises()
      container.update()

      container.setProps({ params: 'second' })
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).not.toHaveEmptyRender()
      const divContainer = resolvedContainer.childAt(0)
      expect(divContainer).toBeDefined()
      expect(divContainer.text()).toBe('first')
      done()
    })
  })

  describe('Executor', () => {
    // The test below is disabled for now because jest do not catch React errors properly
    // See the following issues for further details:
    // https://github.com/facebook/react/issues/11098
    // https://github.com/airbnb/enzyme/issues/1280
    xit('should throw an error if children is not passed', () => {
      const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(value))
      expect(() =>
        mount(
          <PromiseRenderer params="first">
            <PromiseRenderer.Executor />
          </PromiseRenderer>,
        ),
      ).toThrow('<Executor /> component children cannot be empty and should contain only one function as a child.')
    })

    it("should pass execute fn as a children's argument", () => {
      const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(value))
      const children = jest.fn(execute => null)
      const container = mount(
        <PromiseRenderer params={{}}>
          <PromiseRenderer.Executor>{children}</PromiseRenderer.Executor>
        </PromiseRenderer>,
      )
      expect(container).toBeDefined()
      expect(children).toHaveBeenCalledWith(container.instance().execute)
    })
  })
})
