import * as PropTypes from 'prop-types'
import { isFunction, invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createRejected = (contextPropName, rootDisplayName) => {
  /**
   * Type of children function for {@link AsyncCall.Rejected}
   * @function RejectedChildrenFunction
   * @param {object} params
   * @param {any} params.rejectReason
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class
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
  const Rejected = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Rejected.displayName, rootDisplayName)

    return (
      (contextProps.rejected &&
        (isFunction(props.children) ? props.children({ rejectReason: contextProps.rejectReason }) : props.children)) ||
      null
    )
  }

  Rejected.contextTypes = {
    [contextPropName]: PropTypes.shape({
      rejected: PropTypes.bool,
      rejectReason: PropTypes.any,
    }),
  }

  if (process.env.NODE_ENV !== 'production') {
    Rejected.propTypes = {
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }
    Rejected.displayName = `${rootDisplayName}.Rejected`
  }

  return Rejected
}
