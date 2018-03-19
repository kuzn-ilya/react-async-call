import * as React from 'react'
import * as PropTypes from 'prop-types'
import shallowEqual from 'fbjs/lib/shallowEqual'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'
import { createRunning } from './Running'
import { createResolved } from './Resolved'
import { createRejected } from './Rejected'
import { createExecutor } from './Executor'
import { createResult } from './Result'
import { createState } from './State'

let counter = 1

export const createAsynCallComponent = (fn, displayName) => {
  const contextPropName = `__react-promise-renderer__${counter++}`
  const rootDisplayName = `${displayName || 'AsyncCall'}`

  return class extends React.Component {
    static childContextTypes = {
      [contextPropName]: PropTypes.shape({
        hasResult: PropTypes.bool,
        running: PropTypes.bool,
        rejected: PropTypes.bool,
        resolved: PropTypes.bool,
        rejectReason: PropTypes.any,
        result: PropTypes.any,
        execute: PropTypes.func,
      }),
    }

    static propTypes = {
      params: PropTypes.any.isRequired,
      mergeResult: PropTypes.func,
    }

    static defaultProps = {
      mergeResult: (_, currentResult) => currentResult,
    }

    static displayName = rootDisplayName

    static Running = createRunning(contextPropName, rootDisplayName)
    static Resolved = createResolved(contextPropName, rootDisplayName)
    static Rejected = createRejected(contextPropName, rootDisplayName)
    static Executor = createExecutor(contextPropName, rootDisplayName)
    static Result = createResult(contextPropName, rootDisplayName)
    static State = createState(contextPropName, rootDisplayName)

    state = {
      running: true,
      rejected: false,
      resolved: false,
      hasResult: false,
    }

    getChildContext() {
      return {
        [contextPropName]: {
          ...this.state,
          execute: this.execute,
        },
      }
    }

    componentDidMount() {
      invariant(
        isFunction(fn),
        'Function should be passed to createAsyncCallComponent as a first argument but got %s.',
        fn,
      )
      this.callQueryFunc(this.props.params)
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps.params, this.props.params)) {
        this.callQueryFunc(nextProps.params)
      }
    }

    callQueryFunc = params => {
      this.setState({ running: true, rejected: false, resolved: false, rejectReason: undefined })
      const promise = fn(params)
      invariant(
        promise && promise.then && isFunction(promise.then),
        'Function supplied to "createAsyncCallComponent" function should return a promise.',
      )
      promise
        .then(value =>
          this.setState({
            running: false,
            rejected: false,
            resolved: true,
            hasResult: true,
            result: this.state.hasResult ? this.props.mergeResult(this.state.result, value) : value,
          }),
        )
        .catch(reason => this.setState({ running: false, rejected: true, rejectReason: reason }))
    }

    execute = () => {
      this.callQueryFunc()
    }

    render() {
      return (
        this.props.children !== undefined &&
        (isFunction(this.props.children)
          ? this.props.children({
              ...this.state,
              execute: this.execute,
            })
          : this.props.children)
      )
    }
  }
}
