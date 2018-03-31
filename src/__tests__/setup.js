import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

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
