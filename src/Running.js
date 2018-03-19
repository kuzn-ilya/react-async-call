import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createRunning = (contextPropName, rootDisplayName) =>
  class Running extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        running: PropTypes.bool,
      }),
    }
    static displayName = `${rootDisplayName}.Running`

    state = {
      running: this.context[contextPropName] && this.context[contextPropName].running,
    }

    updateState(context) {
      invariant(
        context[contextPropName],
        `<${Running.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )

      if (this.state.running !== context[contextPropName].running) {
        this.setState({
          running: context[contextPropName].running,
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
      return nextContext[contextPropName].running !== this.state.running
    }

    render() {
      return this.state.running ? this.props.children : null
    }
  }
