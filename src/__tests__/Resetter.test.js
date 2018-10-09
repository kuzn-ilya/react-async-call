import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

describe('<Resetter>', () => {
  let spyOnConsoleError

  beforeEach(() => {
    spyOnConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(jest.restoreAllMocks)

  it('should throw an error if <Resetter> component is rendered as a direct child of <AsyncCall>', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())

    expect(() =>
      mount(
        <AsyncCall params={1}>
          <AsyncCall.ResultStore.Resetter>{() => null}</AsyncCall.ResultStore.Resetter>
        </AsyncCall>,
      ),
    ).toThrow('<AsyncCall.ResultStore.Resetter> must be a child (direct or indirect) of <AsyncCall.ResultStore>.')
  })

  it('should throw an error if `children` property is not set', () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))

    mount(
      <AsyncCall params="first">
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.Resetter />
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )

    expect(spyOnConsoleError).toHaveBeenCalled()
    expect(spyOnConsoleError.mock.calls[0][0]).toContain(
      'The prop `children` is marked as required in `AsyncCall.ResultStore.Resetter`, but its value is `undefined`',
    )
  })
})

describe('<Resetter>', () => {
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
    expect(AsyncCall.ResultStore.Resetter).toBeDefined()
  })

  it('should expose default display name', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(AsyncCall.ResultStore.Resetter.displayName).toBe('AsyncCall.ResultStore.Resetter')
  })

  it('should throw an error if <Resetter> component is rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.ResultStore.Resetter>{() => null}</AsyncCall.ResultStore.Resetter>)).toThrow(
      '<AsyncCall.ResultStore.Resetter> must be a child (direct or indirect) of <AsyncCall.ResultStore>.',
    )
  })

  it("render props: should pass `reset` method as a children's argument", () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(params => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.ResultStore>
          <AsyncCall.ResultStore.Resetter>{children}</AsyncCall.ResultStore.Resetter>
        </AsyncCall.ResultStore>
      </AsyncCall>,
    )
    expect(container).toExist()
    const resultStoreContainer = container.find(AsyncCall.ResultStore)
    expect(resultStoreContainer).toExist()
    expect(children).toHaveBeenCalledWith({ reset: resultStoreContainer.instance().reset })
  })
})
