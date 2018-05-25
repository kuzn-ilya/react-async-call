import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createExecutor = (contextPropName, rootDisplayName) => {
  const Executor = (props, context) => {
    const contextProps = context[contextPropName]

    invariant(contextProps, `<${Executor.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`)

    return (isFunction(props.children) && props.children({ execute: contextProps.execute })) || null
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
