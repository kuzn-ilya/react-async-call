import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createState = (contextPropName, rootDisplayName) => {
  const State = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, `<${State.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`)

    return (
      (isFunction(props.children) &&
        props.children({
          ...contextProps,
        })) ||
      null
    )
  }

  State.contextTypes = {
    [contextPropName]: PropTypes.shape({
      hasResult: PropTypes.bool,
      running: PropTypes.bool,
      rejected: PropTypes.bool,
      resolved: PropTypes.bool,
      rejectReason: PropTypes.any,
      result: PropTypes.any,
      execute: PropTypes.func,
    }),
  }

  State.propTypes = {
    children: PropTypes.func.isRequired,
  }

  State.displayName = `${rootDisplayName}.State`

  return State
}
