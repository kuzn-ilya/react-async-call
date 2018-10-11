import * as React from 'react'
import * as PropTypes from 'prop-types'
import { isFunction, invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createState = (Consumer, rootDisplayName) => {
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
   * @class
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
  const State = props => (
    <Consumer>
      {contextProps => {
        invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, State.displayName, rootDisplayName)

        return (
          (isFunction(props.children) &&
            props.children({
              ...contextProps,
            })) ||
          null
        )
      }}
    </Consumer>
  )

  if (process.env.NODE_ENV !== 'production') {
    State.propTypes = {
      children: PropTypes.func.isRequired,
    }
    State.displayName = `${rootDisplayName}.State`
  }

  return State
}
