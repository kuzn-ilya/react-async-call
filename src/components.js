import {
  requiredFuncPropType,
  nodePropType,
  renderChildren,
  nodeOrFuncPropType,
  createAsyncCallChildFactory,
  invariant,
  isFunction,
  INVARIANT_COMPONENT_WAS_ALREADY_REGISTERED,
} from './utils'

const components = {
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
  Running: createAsyncCallChildFactory(
    props => props.running && props.children,
    nodePropType,
    process.env.NODE_ENV !== 'production' && 'Running',
  ),

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
  Resolved: createAsyncCallChildFactory(
    props => props.resolved && renderChildren({ children: props.children, result: props.result }),
    nodeOrFuncPropType,
    process.env.NODE_ENV !== 'production' && 'Resolved',
  ),

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

  Rejected: createAsyncCallChildFactory(
    props => props.rejected && renderChildren({ children: props.children, rejectReason: props.rejectReason }),
    nodeOrFuncPropType,
    process.env.NODE_ENV !== 'production' && 'Rejected',
  ),

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
  Executor: createAsyncCallChildFactory(
    props => renderChildren({ children: props.children, execute: props.execute }),
    requiredFuncPropType,
    process.env.NODE_ENV !== 'production' && 'Executor',
  ),

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
  State: createAsyncCallChildFactory(
    renderChildren,
    requiredFuncPropType,
    process.env.NODE_ENV !== 'production' && 'State',
  ),

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
  Completed: createAsyncCallChildFactory(
    props => (props.resolved || props.rejected) && props.children,
    nodePropType,
    process.env.NODE_ENV !== 'production' && 'Completed',
  ),
}

export const forEachComponent = callback => Object.keys(components).forEach(name => callback(name, components[name]))

export const registerComponent = (name, factory) => {
  invariant(!isFunction(components[name]), INVARIANT_COMPONENT_WAS_ALREADY_REGISTERED, name)
  components[name] = factory
}
