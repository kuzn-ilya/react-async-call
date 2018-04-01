import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createRunning = (contextPropName, rootDisplayName) => {
  const Running = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(
      contextProps,
      `<${Running.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

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
