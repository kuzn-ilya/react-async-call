import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createExecutor = (contextPropName, rootDisplayName) =>
  class Executor extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        execute: PropTypes.func.isRequired,
      }),
    }
    static displayName = `${rootDisplayName}.Executor`

    static propTypes = {
      children: PropTypes.func.isRequired,
    }

    state = {
      execute: this.context[contextPropName] && this.context[contextPropName].execute,
    }

    updateState(context) {
      invariant(
        context[contextPropName],
        `<${Executor.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )

      if (context[contextPropName].execute !== this.state.execute) {
        this.setState({ execute: context[contextPropName].execute })
      }
    }

    componentDidMount() {
      this.updateState(this.context)
    }

    componentWillReceiveProps(_, nextContext) {
      this.updateState(nextContext)
    }

    shouldComponentUpdate(_, nextState, nextContext) {
      return nextContext[contextPropName].execute !== this.state.execute
    }

    render() {
      return this.props.children(this.state.execute)
    }
  }
