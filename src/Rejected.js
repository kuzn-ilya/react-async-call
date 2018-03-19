import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction } from './common'

export const createRejected = (contextPropName, rootDisplayName) =>
  class Rejected extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        rejected: PropTypes.bool,
        rejectReason: PropTypes.any,
      }),
    }

    static propTypes = {
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    }

    static displayName = `${rootDisplayName}.Rejected`

    state = {
      rejected: this.context[contextPropName] && this.context[contextPropName].rejected,
      rejectReason: this.context[contextPropName] && this.context[contextPropName].rejectReason,
    }

    updateState(context) {
      invariant(
        context[contextPropName],
        `<${Rejected.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )

      if (
        context[contextPropName].rejected !== this.state.rejected ||
        context[contextPropName].rejectReason !== this.state.rejectReason
      ) {
        this.setState({
          rejected: context[contextPropName].rejected,
          rejectReason: context[contextPropName].rejectReason,
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
      return (
        nextContext[contextPropName].rejected !== this.state.rejected ||
        nextContext[contextPropName].rejectReason !== this.state.rejectReason
      )
    }

    render() {
      return this.state.rejected
        ? isFunction(this.props.children) ? this.props.children(this.state.rejectReason) : this.props.children
        : null
    }
  }
