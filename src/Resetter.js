import * as React from 'react'
import * as PropTypes from 'prop-types'
import { isFunction, invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createResetter = (Consumer, rootDisplayName) => {
  /**
   * Reset function
   * @function ResetFunction
   * @param {bool} [execute=false] Wether execute promise-returning function after resetting or not.
   * @remark type definition
   */

  /**
   * Type of children function for {@link AsyncCall.ResultStore.Resetter}
   * @function ResetterChildrenFunction
   * @param {object} params
   * @param {ResetFunction} params.reset Function for manual clearing of {@link AsyncCall.ResultStore}.
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class
   * @classdesc
   * React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object
   * with a function for manual reset of {@link AsyncCall.ResultStore}.
   * @example
   * ```jsx
   * <AsyncCall.ResultStore.Resetter>{({ reset }) => <button onClick={reset}>Reset</button>}</AsyncCall.ResultStore.Resetter>
   * ```
   * @property {ResetterChildrenFunction} children
   * @static
   * @extends {React.StatelessComponent}
   * @memberof AsyncCall.ResultStore
   */
  const Resetter = props => (
    <Consumer>
      {contextProps => {
        invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Resetter.displayName, rootDisplayName)

        return (isFunction(props.children) && props.children({ reset: contextProps.reset })) || null
      }}
    </Consumer>
  )

  if (process.env.NODE_ENV !== 'production') {
    Resetter.propTypes = {
      children: PropTypes.func.isRequired,
    }
    Resetter.displayName = `${rootDisplayName}.Resetter`
  }

  return Resetter
}
