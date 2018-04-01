import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createRejected = (contextPropName, rootDisplayName) => {
  const Rejected = (props, context) => {
    const contextProps = context[contextPropName]
    
    invariant(
      contextProps,
      `<${Rejected.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return (
      (contextProps.rejected &&
        (isFunction(props.children) ? props.children({ rejectReason: contextProps.rejectReason }) : props.children)) ||
      null
    )
  }

  Rejected.contextTypes = {
    [contextPropName]: PropTypes.shape({
      rejected: PropTypes.bool,
      rejectReason: PropTypes.any,
    }),
  }

  Rejected.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }

  Rejected.displayName = `${rootDisplayName}.Rejected`

  return Rejected
}
