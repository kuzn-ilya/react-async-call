import * as React from 'react'
import { shallow, mount } from 'enzyme'

import createAsyncCallComponent from '../index'
import { flushPromises } from './common'

describe('Resolved', () => {
  describe('invariants', () => {
    it('should be exposed as a static prop from AsyncCall', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Resolved).toBeDefined()
    })

    it('should expose default display names', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(AsyncCall.Resolved.displayName).toBe('AsyncCall.Resolved')
    })

    it('should throw an error if Resolved component rendered alone', () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      expect(() => shallow(<AsyncCall.Resolved />)).toThrow(
        '<AsyncCall.Resolved> must be a child (direct or indirect) of <AsyncCall>.',
      )
    })
  })

  describe('render props', () => {
    it("should not call Resolved's children fn if promise has not been resolved yet", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const children = jest.fn(() => void 0)
      mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
        </AsyncCall>,
      )

      expect(children).not.toHaveBeenCalled()
    })

    it("should not call Resolved's children fn if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
      const children = jest.fn(() => void 0)
      mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      expect(children).not.toHaveBeenCalled()
      done()
    })

    it("should call Resolved's children fn if promise has been resolved", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve(42))
      const children = jest.fn(() => <div>ABCDEF</div>)
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      expect(children).toHaveBeenCalledWith({ result: 42 })
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).not.toBeEmptyRender()
      expect(resolvedContainer.text()).toBe('ABCDEF')

      done()
    })

    it("should not call Resolved's children function if promise has not been resolved the second time", async done => {
      const AsyncCall = createAsyncCallComponent(value => Promise.resolve(value))
      const children = jest.fn(result => null)
      const container = mount(
        <AsyncCall params="first">
          <AsyncCall.Resolved>{children}</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      container.instance().execute()
      expect(children).toHaveBeenCalledTimes(1)

      done()
    })
  })

  describe('children', () => {
    it("should not render Resolved's children if promise has not been resolved yet", () => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
        </AsyncCall>,
      )

      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toBeEmptyRender()
    })

    it("should not render Resolved's children if promise has been rejected", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.reject('error'))
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toBeEmptyRender()

      done()
    })

    it("should render Resolved's empty children if promise has been resolved", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved />
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)

      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toBeEmptyRender()

      done()
    })

    it("should render Resolved's children if promise has been resolved", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>
            <div>abcdef</div>
          </AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      container.update()

      expect(container.children().exists()).toBe(true)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).not.toBeEmptyRender()
      expect(resolvedContainer.text()).toBe('abcdef')

      done()
    })

    it("should render Resolved's children array if promise has been resolved", async done => {
      const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
      const container = mount(
        <AsyncCall params={{}}>
          <AsyncCall.Resolved>
            <div>abcdef</div>
            <div>qwerty</div>
          </AsyncCall.Resolved>
        </AsyncCall>,
      )

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

    it("should not render Resolved's children if promise has not been resolved the second time", async done => {
      const fn = jest.fn(value => Promise.resolve(value))
      const AsyncCall = createAsyncCallComponent(fn)
      const container = mount(
        <AsyncCall params="first">
          <AsyncCall.Resolved>abcdef</AsyncCall.Resolved>
        </AsyncCall>,
      )

      await flushPromises()
      container.instance().execute()

      expect(fn).toHaveBeenCalledTimes(2)
      const resolvedContainer = container.childAt(0)
      expect(resolvedContainer).toBeDefined()
      expect(resolvedContainer).toBeEmptyRender()

      done()
    })

    const values = [false, null, undefined]
    values.forEach(value =>
      it(`should render Resolved's children fn that returns ${value} if promise has been resolved`, async done => {
        const AsyncCall = createAsyncCallComponent(() => Promise.resolve())
        const container = mount(
          <AsyncCall params={{}}>
            <AsyncCall.Resolved>{() => value}</AsyncCall.Resolved>
          </AsyncCall>,
        )

        await flushPromises()
        container.update()

        expect(container.children().exists()).toBe(true)
        const resolvedContainer = container.childAt(0)

        expect(resolvedContainer).toBeDefined()
        expect(resolvedContainer).toBeEmptyRender()

        done()
      }),
    )

    it('should not clash two promise renderers', async done => {
      const FirstAsyncCall = createAsyncCallComponent(() => Promise.resolve('first'))
      const SecondAsyncCall = createAsyncCallComponent(() => Promise.resolve('second'))
      const secondAsyncCall = mount(
        <SecondAsyncCall params={{}}>
          <FirstAsyncCall params={{}}>
            <FirstAsyncCall.Resolved>
              <div>first</div>
            </FirstAsyncCall.Resolved>
            <SecondAsyncCall.Resolved>
              <div>second</div>
            </SecondAsyncCall.Resolved>
          </FirstAsyncCall>
        </SecondAsyncCall>,
      )

      expect(secondAsyncCall).toBeDefined()
      await flushPromises()
      secondAsyncCall.update()

      const firstAsyncCall = secondAsyncCall.childAt(0)
      expect(firstAsyncCall).toBeDefined()
      expect(firstAsyncCall.children().length).toBe(2)
      expect(firstAsyncCall.childAt(0).text()).toBe('first')
      expect(firstAsyncCall.childAt(1).text()).toBe('second')

      done()
    })
  })
})
