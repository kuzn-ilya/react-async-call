import * as React from 'react'
import * as PropTypes from 'prop-types'
import shallowEqual from 'fbjs/lib/shallowEqual'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'
import { createRunning } from './Running'
import { createResolved } from './Resolved'
import { createRejected } from './Rejected'
import { createExecutor } from './Executor'
import { createState } from './State'
import { createResultStore } from './ResultStore'
import { createCompleted } from './Completed'

let counter = 1

export const createAsynCallComponent = (fn, displayName) => {
  const contextPropName = `__react-async-call__${counter++}`
  const rootDisplayName = `${displayName || 'AsyncCall'}`

  return class extends React.Component {
    static childContextTypes = {
      [contextPropName]: PropTypes.shape({
        result: PropTypes.any,
        running: PropTypes.bool,
        rejected: PropTypes.bool,
        resolved: PropTypes.bool,
        rejectReason: PropTypes.any,
        execute: PropTypes.func,
      }),
    }

    static propTypes = {
      params: PropTypes.any.isRequired,
      lazy: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }

    static displayName = rootDisplayName

    static Running = createRunning(contextPropName, rootDisplayName)
    static Resolved = createResolved(contextPropName, rootDisplayName)
    static Rejected = createRejected(contextPropName, rootDisplayName)
    static Executor = createExecutor(contextPropName, rootDisplayName)
    static State = createState(contextPropName, rootDisplayName)
    static ResultStore = createResultStore(contextPropName, rootDisplayName)
    static Completed = createCompleted(contextPropName, rootDisplayName)
    static contextPropName = contextPropName

    state = {
      running: true,
      rejected: false,
      resolved: false,
    }

    getChildContext() {
      return {
        [contextPropName]: this._getState(),
      }
    }

    componentDidMount() {
      invariant(
        isFunction(fn),
        'Function should be passed to createAsyncCallComponent as a first argument but got %s.',
        fn,
      )
      this._mounted = true
      if (!this.props.lazy) {
        this._callQueryFunc(this.props.params)
      }
    }

    componentWillUnmount() {
      this._mounted = false
    }

    componentWillReceiveProps(nextProps) {
      if (!nextProps.lazy && !shallowEqual(nextProps.params, this.props.params)) {
        this._callQueryFunc(nextProps.params)
      }
    }

    _callQueryFunc = params => {
      this.setState({ running: true, rejected: false, resolved: false })
      const promise = fn(params)
      invariant(
        promise && promise.then && isFunction(promise.then),
        'Function supplied to "createAsyncCallComponent" function should return a promise.',
      )
      promise.then(
        result => {
          if (this._mounted) {
            this.setState({
              running: false,
              rejected: false,
              resolved: true,
              result,
            })
          }
        },
        rejectReason => {
          if (this._mounted) {
            this.setState({ running: false, rejected: true, rejectReason })
          }
        },
      )
    }

    _getState = () => {
      const result = this.state.resolved ? { result: this.state.result } : {}
      const rejectReason = this.state.rejected ? { rejectReason: this.state.rejectReason } : {}

      return {
        running: this.state.running,
        rejected: this.state.rejected,
        resolved: this.state.resolved,
        execute: this.execute,
        ...result,
        ...rejectReason,
      }
    }

    execute = () => {
      this._callQueryFunc(this.props.params)
    }

    render() {
      return (
        this.props.children !== undefined &&
        (isFunction(this.props.children) ? this.props.children(this._getState()) || null : this.props.children)
      )
    }
  }
}
