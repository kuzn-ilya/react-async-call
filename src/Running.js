import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createRunning = (contextPropName, rootDisplayName) => {
  const Running = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Running.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )
    return context[contextPropName].running ? props.children : null
  }

  Running.contextTypes = {
    [contextPropName]: PropTypes.shape({
      running: PropTypes.bool,
    }),
  }
  Running.displayName = `${rootDisplayName}.Running`

  return Running
}
