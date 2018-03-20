import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createHasResult = (contextPropName, rootDisplayName) => {
  const HasResult = (props, context) => {
    invariant(
      context[contextPropName],
      `<${HasResult.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return context[contextPropName].hasResult ? props.children(context[contextPropName].result) : null
  }

  HasResult.contextTypes = {
    [contextPropName]: PropTypes.shape({
      hasResult: PropTypes.bool,
      result: PropTypes.any,
    }),
  }

  HasResult.propTypes = {
    children: PropTypes.func.isRequired,
  }

  HasResult.displayName = `${rootDisplayName}.HasResult`

  return HasResult
}
