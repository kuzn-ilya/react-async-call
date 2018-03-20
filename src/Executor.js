import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createExecutor = (contextPropName, rootDisplayName) => {
  const Executor = (props, context) => {
    invariant(
      context[contextPropName],
      `<${Executor.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
    )

    return props.children(context[contextPropName].execute)
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