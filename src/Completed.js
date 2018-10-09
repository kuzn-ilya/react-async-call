import * as PropTypes from 'prop-types'
import { invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createCompleted = (contextPropName, rootDisplayName) => {
  /**
   * @class
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
  const Completed = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Completed.displayName, rootDisplayName)

    return ((contextProps.resolved || contextProps.rejected) && props.children) || null
  }

  Completed.contextTypes = {
    [contextPropName]: PropTypes.shape({
      resolved: PropTypes.bool,
      rejected: PropTypes.bool,
    }),
  }

  Completed.displayName = `${rootDisplayName}.Completed`

  return Completed
}
