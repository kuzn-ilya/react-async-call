import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { resultStoreContextPropType, resultStoreContextPropName } from './common'

export const createHasResult = (contextPropName, rootDisplayName) => {
  const HasResult = (props, context) => {
    invariant(
      context[contextPropName] && context[contextPropName][resultStoreContextPropName],
      `<${HasResult.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return (
      (context[contextPropName][resultStoreContextPropName].hasResult &&
        props.children({ result: context[contextPropName][resultStoreContextPropName].result })) ||
      null
    )
  }

  HasResult.contextTypes = {
    [contextPropName]: resultStoreContextPropType,
  }

  HasResult.propTypes = {
    children: PropTypes.func.isRequired,
  }

  HasResult.displayName = `${rootDisplayName}.HasResult`

  return HasResult
}
