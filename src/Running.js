import * as React from 'react'
import * as PropTypes from 'prop-types'
import { invariant, INVARIANT_MUST_BE_A_CHILD } from './common'

export const createRunning = (Consumer, rootDisplayName) => {
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
  const Running = props => (
    <Consumer>
      {contextProps => {
        invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Running.displayName, rootDisplayName)

        return (contextProps.running && props.children) || null
      }}
    </Consumer>
  )

  if (process.env.NODE_ENV !== 'production') {
    Running.propTypes = {
      children: PropTypes.node,
    }
    Running.displayName = `${rootDisplayName}.Running`
  }

  return Running
}
