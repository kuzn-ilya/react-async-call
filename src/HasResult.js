import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { resultStoreContextPropType, resultStoreContextPropName } from './common'

export const createHasResult = (contextPropName, rootDisplayName) => {
  const HasResult = (props, context) => {
    const contextProps = context[contextPropName] && context[contextPropName][resultStoreContextPropName]
    
    invariant(
      contextProps,
      `<${HasResult.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return (
      (contextProps.hasResult &&
        props.children({ result: contextProps.result })) ||
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
