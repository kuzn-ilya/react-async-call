import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('Result', () => {
  it('should throw an error if Result component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Result>{() => {}}</AsyncCall.Result>)).toThrow(
      '<AsyncCall.Result> must be a child (direct or indirect) of <AsyncCall>.',
    )
  })

  // The test below is disabled for now because jest do not catch React errors properly
  // See the following issues for further details:
  // https://github.com/facebook/react/issues/11098
  // https://github.com/airbnb/enzyme/issues/1280
  xit('should throw an error if children is not passed', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    expect(() =>
      mount(
        <AsyncCall params="first">
          <AsyncCall.Result />
        </AsyncCall>,
      ),
    ).toThrow()
  })

  it('should not call children function if promise has not been resolved yet', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Result>{children}</AsyncCall.Result>
      </AsyncCall>,
    )

    expect(container.children().exists()).toBe(true)
    const resultContainer = container.childAt(0)
    expect(resultContainer).toBeDefined()
    expect(resultContainer).toHaveEmptyRender()

    expect(children).not.toHaveBeenCalled()
  })

  it('should not call children function if promise has been rejected', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Result>{children}</AsyncCall.Result>
      </AsyncCall>,
    )

    await flushPromises()

    expect(container.children().exists()).toBe(true)
    const resultContainer = container.childAt(0)
    expect(resultContainer).toBeDefined()
    expect(resultContainer).toHaveEmptyRender()
    expect(children).not.toHaveBeenCalled()

    done()
  })

  it('should call children function and render its result if promise has been resolved', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(value => <div>result</div>)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Result>{children}</AsyncCall.Result>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(children).toHaveBeenCalledWith(42)

    expect(container.children().exists()).toBe(true)
    const resultContainer = container.childAt(0)
    expect(resultContainer).toBeDefined()
    expect(resultContainer).not.toHaveEmptyRender()
    expect(resultContainer.children().exists()).toBe(true)
    expect(resultContainer.childAt(0).text()).toBe('result')

    done()
  })
})
