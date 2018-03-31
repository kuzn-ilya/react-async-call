import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createExecutor = (contextPropName, rootDisplayName) => {
  const Executor = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Executor.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return props.children({ execute: context[contextPropName].execute }) || null
  }

  Executor.contextTypes = {
    [contextPropName]: PropTypes.shape({
      execute: PropTypes.func.isRequired,
    }),
  }

  Executor.displayName = `${rootDisplayName}.Executor`

  Executor.propTypes = {
    children: PropTypes.func.isRequired,
  }

  return Executor
}
