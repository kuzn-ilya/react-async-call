import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'

Enzyme.configure({ adapter: new Adapter() })

expect.extend({
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
