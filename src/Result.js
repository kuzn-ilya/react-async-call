import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createResult = (contextPropName, rootDisplayName) => {
  const Result = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Result.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return context[contextPropName].hasResult ? props.children(context[contextPropName].result) : null
  }

  Result.contextTypes = {
    [contextPropName]: PropTypes.shape({
      hasResult: PropTypes.bool,
      result: PropTypes.any,
    }),
  }

  Result.propTypes = {
    children: PropTypes.func.isRequired,
  }

  Result.displayName = `${rootDisplayName}.Result`

  return Result
}
