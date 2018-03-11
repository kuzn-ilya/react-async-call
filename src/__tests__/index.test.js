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
})

describe('PromiseRenderer', () => {
  it('should throw a warning if a function is not passed to createPromiseRenderer', () => {
    const PromiseRenderer = createPromiseRenderer(undefined)
    expect(() => shallow(<PromiseRenderer params={{}} />)).toThrow(
      'Function should be passed to createPromiseRenderer as a first argument but got undefined.',
    )
  })

  it('should return a component class with static Pending and Resolved component classes', () => {
    const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
    expect(PromiseRenderer).toBeDefined()
    expect(PromiseRenderer).toBeReactComponent()
    expect(PromiseRenderer.Pending).toBeDefined()
    expect(PromiseRenderer.Pending).toBeReactComponent()
    expect(PromiseRenderer.Resolved).toBeDefined()
    expect(PromiseRenderer.Resolved).toBeReactComponent()
    expect(PromiseRenderer.Rejected).toBeDefined()
    expect(PromiseRenderer.Rejected).toBeReactComponent()
  })

  it('should call function passed to createPromiseRenderer on mount', () => {
    const fn = jest.fn(() => Promise.resolve())

    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={{}} />)
    expect(fn).toHaveBeenCalled()
  })

  it('should transfer params property as a function argument on mount', () => {
    const fn = jest.fn(value => Promise.resolve())

    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params="abcdef" />)
    expect(fn).toHaveBeenLastCalledWith('abcdef')
  })

  it('should be called once if params property was not changed', () => {
    const fn = jest.fn(() => Promise.resolve())

    const params = {}
    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={params} />)

    container.setProps({ params })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should be called twice if params property was changed', () => {
    const fn = jest.fn(value => Promise.resolve())
    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={'abc'} />)
    expect(fn).toHaveBeenLastCalledWith('abc')

    container.setProps({ params: 'bcd' })
    expect(fn).toHaveBeenLastCalledWith('bcd')
  })

  it('should call once even if params property references were changed but they are shallow equal', () => {
    const fn = jest.fn(value => Promise.resolve())
    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={{ a: 1 }} />)
    container.setProps({ params: { a: 1 } })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should call children fn and pass true as the first argument to it if promise has not been resolved yet', () => {
    const fn = () => Promise.resolve()
    const children = jest.fn(() => null)

    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)
    expect(children).toHaveBeenLastCalledWith(true, undefined, false, undefined)
  })

  it('should call children fn and pass both false and promise result as arguments to it if promise has been resolved', () => {
    const promise = Promise.resolve(42)
    const fn = () => promise

    const children = jest.fn(() => null)

    const PromiseRenderer = createPromiseRenderer(fn)
    const container = shallow(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)

    expect(children).toHaveBeenLastCalledWith(true, undefined, false, undefined)
    process.nextTick(() => expect(children).toHaveBeenLastCalledWith(false, 42, false, undefined))
  })

  it('should call children fn and pass both true and rejection reason as third and fourth arguments to it if promise has been rejected', () => {
    const promise = Promise.reject('rejected')
    const fn = () => promise

    const children = jest.fn(() => null)

    const PromiseRenderer = createPromiseRenderer(fn)
    const container = mount(<PromiseRenderer params={{}}>{children}</PromiseRenderer>)

    expect(children).toHaveBeenLastCalledWith(true, undefined, false, undefined)
    process.nextTick(() => {
      expect(children).toHaveBeenLastCalledWith(false, undefined, true, 'rejected')
    })
  })

  it('should render children as is if children property is not a function', () => {
    const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
    const container = shallow(<PromiseRenderer params={{}}>abcdef</PromiseRenderer>)
    expect(container.text()).toBe('abcdef')
  })
})

describe('Pending', () => {
  it("should render Pending's children if promise has not been resolved yet", () => {
    const PromiseRenderer = createPromiseRenderer(() => Promise.resolve())
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Pending>abcdef</PromiseRenderer.Pending>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    expect(container.children().exists()).toBe(true)
    const pendingContainer = container.childAt(0)
    expect(pendingContainer).toBeDefined()
    expect(pendingContainer.children().exists()).toBe(true)
    expect(pendingContainer.text()).toBe('abcdef')
  })

  it("should not render Pending's children if promise has been resolved", () => {
    const promise = Promise.resolve()
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Pending>abcdef</PromiseRenderer.Pending>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      container.update()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const pendingContainer = container.childAt(0)
      expect(pendingContainer).toBeDefined()
      expect(pendingContainer.children().exists()).toBe(false)
    })
  })

  it("should not render Pending's children if promise has been rejected", () => {
    const promise = Promise.reject('error')
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Pending>abcdef</PromiseRenderer.Pending>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      container.update()
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const pendingContainer = container.childAt(0)
      expect(pendingContainer).toBeDefined()
      expect(pendingContainer.children().exists()).toBe(false)
    })
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
    expect(rejectedContainer.children().exists()).toBe(false)
  })

  it("should not render Rejected's children if promise has been resolved", () => {
    const promise = Promise.resolve()
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Rejected>abcdef</PromiseRenderer.Rejected>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      expect(container).toBeDefined()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer.children().exists()).toBe(false)
    })
  })

  it("should render Rejected's children if promise has been rejected", () => {
    const promise = Promise.reject('error')
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Rejected>abcdef</PromiseRenderer.Rejected>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      container.update()
      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer.children().exists()).toBe(true)
      expect(rejectedContainer.text()).toBe('abcdef')
    })
  })

  it("should call Rejected's children fn if promise has been rejected", () => {
    const PromiseRenderer = createPromiseRenderer(() => Promise.reject('error:'))
    const children = jest.fn(rejectReason => rejectReason + 'abcdef')
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Rejected>{children}</PromiseRenderer.Rejected>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    expect(children).not.toHaveBeenCalled()
    process.nextTick(() => {
      expect(children).toHaveBeenCalledTimes(1)
      expect(children).toHaveBeenCalledWith('error:')

      expect(container.children().exists()).toBe(true)
      const rejectedContainer = container.childAt(0)
      expect(rejectedContainer).toBeDefined()
      expect(rejectedContainer.text()).toBe('error:abcdef')
    })
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
    expect(resolvedContainer.children().exists()).toBe(false)
  })

  it("should not render Resolved's children if promise has been rejected", () => {
    const promise = Promise.reject('error')
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Resolved>abcdef</PromiseRenderer.Resolved>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer.children().exists()).toBe(false)
    })
  })

  it("should render Resolved's children if promise has been resolved", () => {
    const promise = Promise.resolve()
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Resolved>abcdef</PromiseRenderer.Resolved>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      container.update()
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer.children().exists()).toBe(true)
      expect(resolvedContainer.text()).toBe('abcdef')
    })
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

  it("should call Resolved's children fn if promise has been resolved", () => {
    const promise = Promise.resolve()
    const PromiseRenderer = createPromiseRenderer(() => promise)
    const children = jest.fn(result => 'abcdef')
    const container = mount(
      <PromiseRenderer params={{}}>
        <PromiseRenderer.Resolved>{children}</PromiseRenderer.Resolved>
      </PromiseRenderer>,
    )

    expect(container).toBeDefined()
    process.nextTick(() => {
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer.text()).toBe('abcdef')
    })
  })

  // fit('should not clash two promise renderers', () => {
  //   const firstPromise = Promise.resolve('first')
  //   const secondPromise = Promise.resolve('second')
  //   const FirstPromiseRenderer = createPromiseRenderer(() => firstPromise)
  //   const SecondPromiseRenderer = createPromiseRenderer(() => secondPromise)
  //   const firstChildrenFn = jest.fn(result => null)
  //   const secondChildrenFn = jest.fn(result => null)
  //   const container = mount(
  //     <FirstPromiseRenderer params={{}}>
  //       <SecondPromiseRenderer params={{}}>
  //         <FirstPromiseRenderer.Resolved>{firstChildrenFn}</FirstPromiseRenderer.Resolved>
  //         <SecondPromiseRenderer.Resolved>{secondChildrenFn}</SecondPromiseRenderer.Resolved>
  //       </SecondPromiseRenderer>
  //     </FirstPromiseRenderer>,
  //   )

  //   expect(container).toBeDefined()
  //   process.nextTick(() => {
  //     expect(firstChildrenFn).toHaveBeenCalledTimes(1)
  //     expect(firstChildrenFn).toHaveBeenCalledWith('first')

  //     expect(secondChildrenFn).toHaveBeenCalledTimes(1)
  //     expect(secondChildrenFn).toHaveBeenCalledWith('second')
  //   })
  // })
})
