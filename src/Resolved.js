import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createResolved = (contextPropName, rootDisplayName) => {
  const Resolved = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Resolved.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return context[contextPropName].resolved ? props.children : null
  }

  Resolved.contextTypes = {
    [contextPropName]: PropTypes.shape({
      resolved: PropTypes.bool,
    }),
  }

  Resolved.displayName = `${rootDisplayName}.Resolved`

  return Resolved
}
