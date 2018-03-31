import * as React from 'react'
import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { isFunction, resultStoreContextPropType, resultStoreContextPropName } from './common'
import { createHasResult } from './HasResult'

export const createResultStore = (contextPropName, rootDisplayName) => {
  class ResultStore extends React.Component {
    static childContextTypes = {
      [contextPropName]: resultStoreContextPropType,
    }

    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        resolved: PropTypes.bool,
        result: PropTypes.any,
      }),
    }

    static propTypes = {
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      reduce: PropTypes.func,
      reset: PropTypes.bool,
      initialValue: PropTypes.any,
    }

    static defaultProps = {
      reduce: (_, value) => value,
    }

    static displayName = `${rootDisplayName}.ResultStore`

    static HasResult = createHasResult(contextPropName, ResultStore.displayName)

    state = {
      hasResult: false,
    }

    getChildContext() {
      return {
        [contextPropName]: {
          [resultStoreContextPropName]: this._getState(),
        },
      }
    }

    componentDidMount() {
      if (this.context[contextPropName].resolved || this.props.hasOwnProperty('initialValue')) {
        this.setState({
          hasResult: true,
          result: this.context[contextPropName].resolved
            ? this.context[contextPropName].result
            : this.props.initialValue,
        })
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (nextProps.reset) {
        this.setState({
          hasResult: false,
        })
      }
      if (nextContext[contextPropName].resolved && !this.context[contextPropName].resolved) {
        this.setState(
          prevState =>
            prevState.hasResult
              ? {
                  result: this.props.reduce(prevState.result, nextContext[contextPropName].result),
                }
              : { hasResult: true, result: nextContext[contextPropName].result },
        )
      }
    }

    render() {
      invariant(
        this.context[contextPropName],
        `<${ResultStore.displayName}> must be a child (direct or indirect) of <${rootDisplayName}>.`,
      )

      return (isFunction(this.props.children) ? this.props.children(this._getState()) : this.props.children) || null
    }

    _getState() {
      const result = this.state.hasResult ? { result: this.state.result } : {}
      return {
        hasResult: this.state.hasResult,
        ...result,
      }
    }
  }

  return ResultStore
}
