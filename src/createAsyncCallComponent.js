import * as React from 'react'
import * as PropTypes from 'prop-types'
import {
  createAsyncCallChild,
  renderChildren,
  renderChildrenFn,
  isFunction,
  invariant,
  shallowEqual,
  nodePropType,
  requiredFuncPropType,
  nodeOrFuncPropType,
  INVARIANT_FUNCTION_SHOULD_BE_PASSED,
  INVARIANT_FUNCTION_SHOULD_RETURN_PROMISE,
  DISPLAY_NAME_RUNNING,
  DISPLAY_NAME_RESOLVED,
  DISPLAY_NAME_REJECTED,
  DISPLAY_NAME_EXECUTOR,
  DISPLAY_NAME_STATE,
  DISPLAY_NAME_COMPLETED,
} from './utils'
import { createResultStore } from './ResultStore'
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
  const rootDisplayName = process.env.NODE_ENV !== 'production' && `${displayName || 'AsyncCall'}`

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
    /**
     * @class Running
     * @classdesc
     * React Component. Renders its children whenever async operation was started but is still executing. Otherwise renders nothing.
     * @example
     * ```jsx
     * <AsyncCall.Running>Executing...</AsyncCall.Running>
     * ```
     * @property {ReactNode} children
     * @static
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */
    static Running = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      (props, contextProps) => contextProps.running && props.children,
      DISPLAY_NAME_RUNNING,
      nodePropType,
    )

    /**
     * Type of children function for {@link AsyncCall.Resolved}
     * @function ResolvedChildrenFunction
     * @param {object}
     * @param {any} params.result
     * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
     * @remark type definition
     */

    /**
     * @class Resolved
     * @classdesc
     * React Component. Renders its children whenever async operation has been completed successfully (promise was resolved),
     * but is still not started again. Otherwise renders nothing.
     * Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `result`.
     * @example
     * ```jsx
     * <AsyncCall.Resolved>Last async operation was successful!</AsyncCall.Resolved>
     * ```
     *
     * or
     *
     * ```jsx
     * <AsyncCall.Resolved>{({ result }) => <pre>{JSON.stringify(result)}</pre>}</AsyncCall.Resolved>
     * ```
     * @property {ReactNode | ResolvedChildrenFunction} children
     * @static
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */
    static Resolved = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      (props, contextProps) => contextProps.resolved && renderChildren(props, { result: contextProps.result }),
      DISPLAY_NAME_RESOLVED,
      nodeOrFuncPropType,
    )

    /**
     * Type of children function for {@link AsyncCall.Rejected}
     * @function RejectedChildrenFunction
     * @param {object} params
     * @param {any} params.rejectReason
     * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
     * @remark type definition
     */

    /**
     * @class Rejected
     * @static
     * @classdesc
     * React Component. Renders its children whenever async operation has been completed with failure (promise was rejected),
     * but is still not started again. Otherwise renders nothing.
     * Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `rejectReason`
     * (promise reject reason).
     * @example
     * ```jsx
     * <AsyncCall.Rejected>Error!</AsyncCall.Rejected>
     * ```
     *
     * or
     * ```jsx
     * <AsyncCall.Rejected>{({ rejectReason }) => Error: {rejectReason}}</AsyncCall.Rejected>
     * ```
     * @property {ReactNode | RejectedChildrenFunction} children
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */

    static Rejected = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      (props, contextProps) =>
        contextProps.rejected && renderChildren(props, { rejectReason: contextProps.rejectReason }),
      DISPLAY_NAME_REJECTED,
      nodeOrFuncPropType,
    )

    /**
     * Type of children function for {@link AsyncCall.Executor}
     * @function ExecutorChildrenFunction
     * @param {object} params
     * @param {ExecuteFunction} params.execute Function for manual execution of asynchronous operation.
     * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
     * @remark type definition
     */

    /**
     * @class Executor
     * @classdesc
     * React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object
     * with a function for manual execution of async operation.
     * @example
     * ```jsx
     * <AsyncCall.Executor>{({ execute }) => <button onClick={execute}>Click me!</button>}</AsyncCall.Executor>
     * ```
     * @property {ExecutorChildrenFunction} children
     * @static
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */
    static Executor = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      (props, contextProps) => renderChildrenFn(props, { execute: contextProps.execute }),
      DISPLAY_NAME_EXECUTOR,
      requiredFuncPropType,
    )

    /**
     * Type of children function for {@link AsyncCall.State}
     * @function StateChildrenFunction
     * @param {object} params
     * @param {boolean} params.running Whether async opertation is executing or not.
     * If you only need to process `running`, use either {@link AsyncCall.Running} or {@link AsyncCall.Completed} component instead.
     * @param {boolean} params.resolved Whether async opertation was completed successfully last time or not.
     * If you only need to process `resolved` and `result`, {@link AsyncCall.Resolved} component instead.
     * @param {boolean} params.rejected Whether async opertation failed last time or not.
     * If you only need to process `rejected` and `rejectedStatus`, use {@link AsyncCall.Rejected} component instead.
     * @param {any=} params.rejectReason Contains reject reason if async opertation failed last time.
     * If you only need to process `rejected` and `rejectedReason`, use {@link AsyncCall.Rejected} component instead.
     * @param {any=} params.result Contains result of last successful async operation call.
     * If you only need to process `resolved` and `result`, use {@link AsyncCall.Resolved} component instead.
     * If you need to accumulate result, consider {@link AsyncCall.ResultStore} usage.
     * @param {ExecuteFunction} params.execute Callback for manual execution of async operation.
     * If you only need to execute async operation manualy, use {@link AsyncCall.Executor} component instead.                               |
     * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
     * @remark type definition
     */

    /**
     * @class State
     * @classdesc
     * React Component. Renders its children always. Property `children` must be a function
     * with the only argument receiving an object ([see description of `StateChildrenFunction`]{@link StateChildrenFunction})
     * with the state of async operation. `State` component is handy for complicated UI cases when none of static components of {@link AsyncCall} suits you.
     * @example
     * ```jsx
     * <AsyncCall.State>
     *  {({ running, resolved, result, rejected, rejectReason, execute }) => {
     *    // Something that depends on all of the argument's properties
     *  }}
     * </AsyncCall.State>
     * ```
     * @property {StateChildrenFunction} children
     * @static
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */
    static State = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      renderChildrenFn,
      DISPLAY_NAME_STATE,
      requiredFuncPropType,
    )
    static ResultStore = createResultStore(Consumer, rootDisplayName)

    /**
     * @class Completed
     * @classdesc
     * React Component. Renders its children whenever async operation has been completed (successfully or not),
     * but is still not started again. Otherwise renders nothing.
     *
     * ```jsx
     * <AsyncCall.Completed>
     *   Async operation completed
     * </AsyncCall.Completed>
     * ```
     * @property {ReactNode=} children React children to be rendered whenever async operation is completed.
     * @static
     * @extends {React.StatelessComponent}
     * @memberof AsyncCall
     */
    static Completed = createAsyncCallChild(
      Consumer,
      rootDisplayName,
      (props, contextProps) => (contextProps.resolved || contextProps.rejected) && props.children,
      DISPLAY_NAME_COMPLETED,
      nodePropType,
    )

    state = {
      running: true,
      rejected: false,
      resolved: false,
    }

    componentDidMount() {
      invariant(isFunction(fn), INVARIANT_FUNCTION_SHOULD_BE_PASSED, fn)
      this._mounted = true
      const props = this.props
      if (!props.lazy) {
        this._callQueryFunc(props.params)
      }
    }

    componentWillUnmount() {
      this._mounted = false
    }

    componentDidUpdate(prevProps) {
      const props = this.props
      const params = props.params
      if (!props.lazy && !shallowEqual(params, prevProps.params)) {
        this._callQueryFunc(params)
      }
    }

    _callQueryFunc = params => {
      this.setState({ running: true, rejected: false, resolved: false })
      const promise = fn(params)
      invariant(promise && promise.then && isFunction(promise.then), INVARIANT_FUNCTION_SHOULD_RETURN_PROMISE)
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
      let { running, resolved, rejected, result, rejectReason } = this.state
      rejectReason = rejected ? { rejectReason } : {}

      return {
        running,
        rejected,
        resolved,
        execute: this.execute,
        result,
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
      const state = this._getState()
      const props = this.props
      return <Provider value={state}>{props.children !== undefined && renderChildren(props, state)}</Provider>
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
