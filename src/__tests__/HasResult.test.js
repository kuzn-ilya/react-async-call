import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { flushPromises } from './common'

describe('HasResult', () => {
  describe('invariants', () => {
    it('should be exposed as static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.ResultStore.HasResult).toBeDefined()
    })

    it('should expose default display name', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.ResultStore.HasResult.displayName).toBe('AsyncCall.ResultStore.HasResult')
    })

    it('should throw an error if HasResult component rendered alone', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(() => shallow(<AsyncCall.ResultStore.HasResult>{() => null}</AsyncCall.ResultStore.HasResult>)).toThrow(
        '<AsyncCall.ResultStore.HasResult> must be a child (direct or indirect) of <AsyncCall.ResultStore>.',
      )
    })

    it('should throw an error if HasResult component rendered as a direct child of <AsyncCall>', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = shallow(
        <AsyncCall params={1}>
          <AsyncCall.ResultStore.HasResult>{() => null}</AsyncCall.ResultStore.HasResult>
        </AsyncCall>,
      )

      expect(() => container.dive()).toThrow(
        '<AsyncCall.ResultStore.HasResult> must be a child (direct or indirect) of <AsyncCall.ResultStore>.',
      )
    })

    it('should throw an error if children is not passed', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))

      mount(
        <AsyncCall params="first">
          <AsyncCall.ResultStore>
            <AsyncCall.ResultStore.HasResult />
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('render props', () => {
    it('should not call children fn if promise has not been resolved yet', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const children = jest.fn(() => null)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.ResultStore>
            <AsyncCall.ResultStore.HasResult>{children}</AsyncCall.ResultStore.HasResult>
          </AsyncCall.ResultStore>
        </AsyncCall>,
      )

      const resultStoreContainer = container.find(AsyncCall.ResultStore)
      expect(resultStoreContainer).toExist()

      const resultContainer = resultStoreContainer.find(AsyncCall.ResultStore.HasResult)
      expect(resultContainer).toExist()
      expect(resultContainer).toBeEmptyRender()

      expect(children).not.toHaveBeenCalled()
    })

    it('should not call children fn if promise has been rejected', async done => {
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

      const resultStoreContainer = container.find(AsyncCall.ResultStore)
      expect(resultStoreContainer).toExist()

      const resultContainer = resultStoreContainer.find(AsyncCall.ResultStore.HasResult)
      expect(resultContainer).toExist()
      expect(resultContainer).toBeEmptyRender()

      expect(children).not.toHaveBeenCalled()

      done()
    })

    it('should call children fn and render its result if promise has been resolved', async done => {
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

      const resultContainer = container.find(AsyncCall.ResultStore.HasResult)
      expect(resultContainer).toExist()
      expect(resultContainer).not.toBeEmptyRender()
      expect(resultContainer).toHaveText('result')

      done()
    })
  })
})
