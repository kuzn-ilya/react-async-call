import * as PropTypes from 'prop-types'
import { resultStoreContextPropType } from './common'
import { isFunction, invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createHasResult = (contextPropName, rootDisplayName) => {
  /**
   * Type of children function for {@link AsyncCall.ResultStore.HasResult}
   * @function HasResultChildrenFunction
   * @param {object} params
   * @param {any} params.result
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class
   * @classdesc
   * React Component. Renders its children whenever result store is not empty (has result).
   * Property `children` must be a function with the only argument receiving object with the only field `result`.
   * @example
   * ```jsx
   * <AsyncCall.ResultStore.HasResult>{({result}) => <pre>{JSON.stringify(result)}</pre>}</AsyncCall.ResultStore.HasResult>
   * ```
   * @property {HasResultChildrenFunction} children
   * @static
   * @extends {React.StatelessComponent}
   * @memberof AsyncCall.ResultStore
   */
  const HasResult = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, HasResult.displayName, rootDisplayName)

    return (
      (contextProps.hasResult && isFunction(props.children) && props.children({ result: contextProps.result })) || null
    )
  }

  HasResult.contextTypes = {
    [contextPropName]: resultStoreContextPropType,
  }

  if (process.env.NODE_ENV !== 'production') {
    HasResult.propTypes = {
      children: PropTypes.func.isRequired,
    }
    HasResult.displayName = `${rootDisplayName}.HasResult`
  }

  return HasResult
}
