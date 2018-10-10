import * as PropTypes from 'prop-types'
import { isFunction, invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createResolved = (contextPropName, rootDisplayName) => {
  /**
   * Type of children function for {@link AsyncCall.Resolved}
   * @function ResolvedChildrenFunction
   * @param {object}
   * @param {any} params.result
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class
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
  const Resolved = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Resolved.displayName, rootDisplayName)

    return (
      (contextProps.resolved &&
        (isFunction(props.children) ? props.children({ result: contextProps.result }) : props.children)) ||
      null
    )
  }

  Resolved.contextTypes = {
    [contextPropName]: PropTypes.shape({
      resolved: PropTypes.bool,
    }),
  }

  if (process.env.NODE_ENV !== 'production') {
    Resolved.propTypes = {
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }
  }

  Resolved.displayName = `${rootDisplayName}.Resolved`

  return Resolved
}
