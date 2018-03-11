import * as React from 'react'
import * as PropTypes from 'prop-types'
import shallowEqual from 'fbjs/lib/shallowEqual'
import invariant from 'fbjs/lib/invariant'

const isFunction = value => !!(value && value.constructor && value.call && value.apply)

let counter = 1

const Spread = ({ children }) => children

export const createPromiseRenderer = fn => {
  const resultPropName = `__react-promise-renderer__${counter++}`

  class Pending extends React.Component {
    static contextTypes = {
      [resultPropName]: PropTypes.object,
    }

    state = this.context[resultPropName]

    componentWillReceiveProps(_, nextContext) {
      if (!shallowEqual(nextContext[resultPropName], this.context[resultPropName])) {
        this.setState(nextContext[resultPropName])
      }
    }

    render() {
      return this.state.loading ? <Spread>{this.props.children}</Spread> : null
    }
  }

  class Resolved extends React.Component {
    static contextTypes = {
      [resultPropName]: PropTypes.object,
    }

    state = this.context[resultPropName]

    componentWillReceiveProps(_, nextContext) {
      if (!shallowEqual(nextContext[resultPropName], this.context[resultPropName])) {
        this.setState(nextContext[resultPropName])
      }
    }

    render() {
      return this.state.loading ? null : isFunction(this.props.children) ? (
        this.props.children(this.state.result)
      ) : (
        <Spread>{this.props.children}</Spread>
      )
    }
  }

  class PromiseRenderer extends React.Component {
    static childContextTypes = {
      [resultPropName]: PropTypes.object.isRequired,
    }

    static Pending = Pending
    static Resolved = Resolved

    state = {
      loading: true,
    }

    getChildContext() {
      return {
        [resultPropName]: {
          ...this.state,
        },
      }
    }

    componentDidMount() {
      invariant(
        isFunction(fn),
        'Function should be passed to createPromiseRenderer as a first argument but got undefined.',
        fn,
      )
      this.callQueryFunc(this.props.params)
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps.params, this.props.params)) {
        this.callQueryFunc(nextProps.params)
      }
    }

    callQueryFunc = params => {
      this.setState({ loading: true })
      fn(params).then(value => {
        this.setState({ loading: false, result: value })
        return value
      })
    }

    render() {
      return (
        this.props.children !== undefined &&
        (isFunction(this.props.children)
          ? this.props.children(this.state.loading, this.state.result)
          : this.props.children)
      )
    }
  }

  return PromiseRenderer
}

export default createPromiseRenderer
