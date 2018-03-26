import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createCompleted = (contextPropName, rootDisplayName) => {
  const Completed = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Completed.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )
    return context[contextPropName].resolved || context[contextPropName].rejected ? props.children : null
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
