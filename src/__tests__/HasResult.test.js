import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { getChildrenContainer, getResultStoreChildrenContainer, flushPromises } from './common'

describe('<HasResult>', () => {
  let spyOnConsoleError

  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(jest.restoreAllMocks)

  it('should throw an error if <HasResult> component is rendered as a direct child of <AsyncCall>', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())

    expect(() =>
      mount(
        <AsyncCall params={1}>
          <AsyncCall.ResultStore.HasResult>{() => null}</AsyncCall.ResultStore.HasResult>
        </AsyncCall>,
      ),
    ).toThrow('<AsyncCall.ResultStore.HasResult> must be a child (direct or indirect) of <AsyncCall.ResultStore>.')
  })

  it('should throw an error if <HasResult> component is rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => mount(<AsyncCall.ResultStore.HasResult>{() => null}</AsyncCall.ResultStore.HasResult>)).toThrow(
      '<AsyncCall.ResultStore.HasResult> must be a child (direct or indirect) of <AsyncCall.ResultStore>.',
    )
  })

  it('should throw an error if `children` property is not set', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))

    mount(
      <AsyncCall params="first">
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.HasResult />
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    expect(spyOnConsoleError).toHaveBeenCalled()
    expect(spyOnConsoleError.mock.calls[0][0]).toContain(
      'The prop `children` is marked as required in `AsyncCall.ResultStore.HasResult`, but its value is `undefined`',
    )
  })
})

describe('<HasResult>', () => {
  let spyOnConsoleError
  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    expect(spyOnConsoleError).not.toHaveBeenCalled()
  })

  it('should be exposed as a static prop from <AsyncCall.ResultStore>', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.ResultStore.HasResult).toBeDefined()
  })

  it('should expose default display name', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.ResultStore.HasResult.displayName).toBe('AsyncCall.ResultStore.HasResult')
  })

  it('render props: should not call `children` if promise has not been resolved yet', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.HasResult>{children}</AsyncCall.ResultStore.HasResult>
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    const resultStoreContainer = getChildrenContainer(container, AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()

    const resultContainer = getResultStoreChildrenContainer(resultStoreContainer, AsyncCall.ResultStore.HasResult)
    expect(resultContainer).toExist()
    expect(resultContainer).toBeEmptyRender()

    expect(children).not.toHaveBeenCalled()
  })

  it('render props: should not call `children` if promise has been rejected', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
    const children = jest.fn(() => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.HasResult>{children}</AsyncCall.ResultStore.HasResult>
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()

    const resultStoreContainer = getChildrenContainer(container, AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()

    const resultContainer = getResultStoreChildrenContainer(resultStoreContainer, AsyncCall.ResultStore.HasResult)
    expect(resultContainer).toExist()
    expect(resultContainer).toBeEmptyRender()

    expect(children).not.toHaveBeenCalled()

    done()
  })

  it('render props: should call `children` and render its result if promise has been resolved', async done => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
    const children = jest.fn(value => <div>result</div>)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.HasResult>{children}</AsyncCall.ResultStore.HasResult>
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    await flushPromises()
    container.update()

    expect(children).toHaveBeenCalledWith({ result: 42 })

    const resultContainer = getResultStoreChildrenContainer(container, AsyncCall.ResultStore.HasResult)
    expect(resultContainer).toExist()
    expect(resultContainer).not.toBeEmptyRender()
    expect(resultContainer).toHaveText('result')

    done()
  })
})
