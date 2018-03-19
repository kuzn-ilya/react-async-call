import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createResolved = (contextPropName, rootDisplayName) =>
  class Resolved extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        resolved: PropTypes.bool,
      }),
    }
    static displayName = `${rootDisplayName}.Resolved`

    state = {
      resolved: this.context[contextPropName] && this.context[contextPropName].resolved,
    }

    updateState(context) {
      invariant(
        context[contextPropName],
        `<${Resolved.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )

      if (this.state.resolved !== context[contextPropName].resolved) {
        this.setState({
          resolved: context[contextPropName].resolved,
        })
      }
    }

    componentDidMount() {
      this.updateState(this.context)
    }

    componentWillReceiveProps(_, nextContext) {
      this.updateState(nextContext)
    }

    shouldComponentUpdate(_, nextState, nextContext) {
      return nextContext[contextPropName].resolved !== this.state.resolved
    }

    render() {
      return this.state.resolved ? this.props.children : null
    }
  }
