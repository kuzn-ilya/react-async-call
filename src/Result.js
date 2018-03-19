import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'

export const createResult = (contextPropName, rootDisplayName) =>
  class Result extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        hasResult: PropTypes.bool,
        result: PropTypes.any,
      }),
    }

    state = {
      hasResult: this.context[contextPropName] && this.context[contextPropName].hasResult,
      result: this.context[contextPropName] && this.context[contextPropName].result,
    }

    static propTypes = {
      children: PropTypes.func.isRequired,
    }

    static displayName = `${rootDisplayName}.Result`

    updateState(context) {
      invariant(
        context[contextPropName],
        `<${Result.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )
      if (
        context[contextPropName].hasResult !== this.state.hasResult ||
        context[contextPropName].result !== this.state.result
      ) {
        this.setState({
          hasResult: context[contextPropName].hasResult,
          result: context[contextPropName].result,
        })
      }
    }

    componentDidMount() {
      this.updateState(this.context)
    }

    componentWillReceiveProps(_, nextContext) {
      this.updateState(nextContext)
    }

    render() {
      return this.state.hasResult ? this.props.children(this.state.result) : null
    }
  }
