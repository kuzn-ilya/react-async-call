import * as React from 'react'
import * as PropTypes from 'prop-types'
import { isFunction, invariant, shallowEqual } from './common'
import { createRunning } from './Running'
import { createResolved } from './Resolved'
import { createRejected } from './Rejected'
import { createExecutor } from './Executor'
import { createState } from './State'
import { createResultStore } from './ResultStore'
import { createCompleted } from './Completed'
import createContext from 'create-react-context'

/**
 * Asynchronous function (aka asynchronous operation or promise-returning function)
 * which returns promise based on supplied parameter.
 * @example
 * The function below returns result (`Promise` object) of getting user data from GitHub API by his/her GitHub login:
 * ```
 * const getGitHubUserData = userName => fetch(`https://api.github.com/users/${userName}`).then(data => data.json())
 * ```
 * @function AsyncFunction
 * @param {any} params Parameters, based on which function should return promise.
 * @returns {Promise} Promise object that represents asynchronous operation result.
 * @remark type definition
 */

/**
 * A factory function that creates React component class and binds async operation to it:
 * ```jsx
 * const Fetcher = createAsyncCallComponent(() => fetch('https://api.github.com/repositories').then(data => data.json()))
 * ```
 *
 * After calling of this function you can use returned component and its static sub-components to hook async operation lifecycle:
 *
 * ```jsx
 * // Start executing async operation on Fetcher mount
 * <Fetcher>
 *   <Fetcher.Running>
 *     Renders only if async operation is executing
 *   </Fetcher.Running>
 *
 *   <Fetcher.Resolved>
 *     {({ result }) => (
 *       <div>
 *         Renders if async operation has been executed successfully
 *         <pre>{JSON.stringify(result)}></pre>
 *       </div>
 *     )}}
 *   </Fetcher.Resolved>
 *
 *   <Fetcher.Rejected>
 *     Renders only if async operation failed
 *   </Fetcher.Rejected>
 * </Fetcher>
 * ```
 *
 * `createAsyncCallComponent` is the only member exported by react-async-call package.
 * @param {AsyncFunction} fn See [`AsyncFunction` signature]{@link AsyncFunction} for details.
 * @param {String} [displayName="AsyncCall"] Component name (visible, for example, in React extension of Chrome Dev Tools).
 * @returns {AsyncCall} Returns React [component class `AsyncCall`]{@link AsyncCall} for the further usage.
 * This class contains extra component classes [`Running`]{@link AsyncCall.Running},
 * [`Rejected`]{@link AsyncCall.Rejected}, [`Resolved`]{@link AsyncCall.Resolved},
 * [`Completed`]{@link AsyncCall.Completed}, [`ResultStore`]{@link AsyncCall.ResultStore},
 * [`Executor`]{@link AsyncCall.Executor} and [`State`]{@link AsyncCall.State} which can be used as children
 * (direct or indirect) of `AsyncCall`.
 * @function
 */

export const createAsyncCallComponent = (fn, displayName) => {
  const { Provider, Consumer } = createContext()
  const rootDisplayName = `${displayName || 'AsyncCall'}`

  /**
   * Execute function
   * @function ExecuteFunction
   * @returns {void}
   * @remark type definition
   */

  /**
   * Type of children function for {@link AsyncCall}
   * @function AsyncCallChildrenFunction
   * @param {object} params Represents current status of asynchronous operation.
   * @param {boolean} params.running Indicates whether asynchronous operation is executing or not.
   * @param {boolean} params.rejected Indicates whether asynchronous operation was failed when it was called last time.
   * If `true`, result of promise rejection (error) can be found in the `params.rejectReason`.
   * @param {boolean} params.resolved Indicates whether asynchronous operation was succeeded when it was called last time.
   * If `true`, result of promise resolving can be found in the `params.result`.
   * @param {any=}params.result Contains result of promise (returned by async function) resolving
   * if function call was successful. `undefined` if asynchronous operation is running or promise was rejected.
   * @param {any=} params.rejectReason Contains result of promise (returned by async function) rejection
   * if function call was unsuccessful. `undefined` if asynchronous operation is running or promise was resolved.
   * @param {ExecuteFunction} params.execute Function for manual execution of asynchronous operation.
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @classdesc
   * React Component. This class is returned by call of {@link createAsyncCallComponent} and this is the only way to get it.
   * @property {ReactNode | AsyncCallChildrenFunction} children Property `children` can be either a ReactNode or
   * a function that receives an object as its only argument and return ReactNode.
   * `AsyncCall` component **always** renders its children. We recommend to use
   * [the first form of using `children` property](https://github.com/kuzn-ilya/react-async-call/blob/master/README.md#basic-usage)
   * and respond to async operation execution results using *static sub-components* (like [`Running`]{@link AsyncCall.Running},
   * [`Rejected`]{@link AsyncCall.Rejected}, [`Resolved`]{@link AsyncCall.Resolved},
   * [`Completed`]{@link AsyncCall.Completed}, [`ResultStore`]{@link AsyncCall.ResultStore},
   * [`Executor`]{@link AsyncCall.Executor} and [`State`]{@link AsyncCall.State}).
   * @property {any} params A value that will be passed as a single argument into async function. Every time when change of this property occurs,
   * asyncronous operation restarts.
   * @property {Boolean} [lazy=false] If `true`, component will not start execution of asynchronous operation during component mount phase
   * and on `params` property change. You should start async operation manualy by calling [`execute` method]{@link #AsyncCall+execute}
   * or via [`Executor`]{@link AsyncCall.Executor}.
   * @extends {React.Component}
   */
  class AsyncCall extends React.Component {
    static Running = createRunning(Consumer, rootDisplayName)
    static Resolved = createResolved(Consumer, rootDisplayName)
    static Rejected = createRejected(Consumer, rootDisplayName)
    static Executor = createExecutor(Consumer, rootDisplayName)
    static State = createState(Consumer, rootDisplayName)
    static ResultStore = createResultStore(Consumer, rootDisplayName)
    static Completed = createCompleted(Consumer, rootDisplayName)

    state = {
      running: true,
      rejected: false,
      resolved: false,
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

    /**
     * Method for executing async operation manually.
     * It is recommended to use [`<Executor>` component]{@link AsyncCall.Executor} instead.
     * @method
     */
    execute = () => {
      this._callQueryFunc(this.props.params)
    }

    render() {
      return (
        <Provider value={this._getState()}>
          {this.props.children !== undefined &&
            (isFunction(this.props.children) ? this.props.children(this._getState()) || null : this.props.children)}
        </Provider>
      )
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    AsyncCall.propTypes = {
      params: PropTypes.any.isRequired,
      lazy: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }
    AsyncCall.displayName = rootDisplayName
    AsyncCall.Consumer = Consumer
  }

  return AsyncCall
}
