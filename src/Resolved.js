import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createResolved = (contextPropName, rootDisplayName) => {
  const Resolved = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Resolved.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return (
      context[contextPropName].resolved &&
      props.children !== undefined &&
      (isFunction(props.children) ? props.children(context[contextPropName].result) || null : props.children)
    )
  }

  Resolved.contextTypes = {
    [contextPropName]: PropTypes.shape({
      resolved: PropTypes.bool,
    }),
  }

  Resolved.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }

  Resolved.displayName = `${rootDisplayName}.Resolved`

  return Resolved
}
