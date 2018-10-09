import * as PropTypes from 'prop-types'
import { invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createRunning = (contextPropName, rootDisplayName) => {
  /**
   * @class
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
  const Running = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Running.displayName, rootDisplayName)

    return (contextProps.running && props.children) || null
  }

  Running.contextTypes = {
    [contextPropName]: PropTypes.shape({
      running: PropTypes.bool,
    }),
  }

  Running.displayName = `${rootDisplayName}.Running`

  return Running
}
