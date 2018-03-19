import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'

describe('Executor', () => {
  it('should throw an error if Executor component rendered alone', () => {
    const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
    expect(() => shallow(<AsyncCall.Executor>{() => void 0}</AsyncCall.Executor>)).toThrow(
      '<AsyncCall.Executor> must be a child (direct or indirect) of <AsyncCall>.',
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
          <AsyncCall.Executor />
        </AsyncCall>,
      ),
    ).toThrow()
  })

  it("should pass execute fn as a children's argument", () => {
    const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
    const children = jest.fn(execute => null)
    const container = mount(
      <AsyncCall params={{}}>
        <AsyncCall.Executor>{children}</AsyncCall.Executor>
      </AsyncCall>,
    )
    expect(container).toBeDefined()
    expect(children).toHaveBeenCalledWith(container.instance().execute)
  })
})
