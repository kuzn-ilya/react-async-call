import * as React from 'react'
import * as PropTypes from 'prop-types'
import shallowEqual from 'fbjs/lib/shallowEqual'
import invariant from 'fbjs/lib/invariant'

const isFunction = value => !!(value && value.constructor && value.call && value.apply)

let counter = 1

export const createPromiseRenderer = fn => {
  const contextPropName = `__react-promise-renderer__${counter++}`

  class Pending extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        loading: PropTypes.bool,
      }),
    }

    state = {
      loading: this.context[contextPropName].loading,
    }

    componentWillReceiveProps(_, nextContext) {
      if (this.state.loading !== nextContext[contextPropName].loading) {
        this.setState({
          loading: nextContext[contextPropName].loading,
        })
      }
    }

    shouldComponentUpdate(_, nextState, nextContext) {
      return nextContext[contextPropName].loading !== this.state.loading
    }

    render() {
      return this.state.loading ? this.props.children : null
    }
  }

  class Resolved extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        loading: PropTypes.bool,
        rejected: PropTypes.bool,
        result: PropTypes.any,
      }),
    }

    state = {
      resolved: !this.context[contextPropName].loading && !this.context[contextPropName].rejected,
      result: this.context[contextPropName].result,
    }

    componentWillReceiveProps(_, nextContext) {
      if (
        this.state.resolved !== (!nextContext[contextPropName].loading && !nextContext[contextPropName].rejected) ||
        this.state.result !== nextContext[contextPropName].result
      ) {
        this.setState({
          resolved: !nextContext[contextPropName].loading && !nextContext[contextPropName].rejected,
          result: nextContext[contextPropName].result,
        })
      }
    }

    shouldComponentUpdate(_, nextState, nextContext) {
      return (
        (!nextContext[contextPropName].loading && !nextContext[contextPropName].rejected !== this.state.resolved) ||
        nextContext[contextPropName].result !== this.state.result
      )
    }

    render() {
      return this.state.resolved
        ? isFunction(this.props.children) ? this.props.children(this.state.result) : this.props.children
        : null
    }
  }

  class Rejected extends React.Component {
    static contextTypes = {
      [contextPropName]: PropTypes.shape({
        rejected: PropTypes.bool,
        rejectReason: PropTypes.any,
      }),
    }

    state = {
      rejected: this.context[contextPropName].rejected,
      rejectReason: this.context[contextPropName].rejectReason,
    }

    componentWillReceiveProps(_, nextContext) {
      if (
        nextContext[contextPropName].rejected !== this.state.rejected ||
        nextContext[contextPropName].rejectReason !== this.state.rejectReason
      ) {
        this.setState({
          rejected: nextContext[contextPropName].rejected,
          rejectReason: nextContext[contextPropName].rejectReason,
        })
      }
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

  return class extends React.Component {
    static childContextTypes = {
      [contextPropName]: PropTypes.shape({
        loading: PropTypes.bool,
        rejected: PropTypes.bool,
        rejectReason: PropTypes.any,
        result: PropTypes.any,
      }),
    }

    static propTypes = {
      params: PropTypes.any.isRequired,
    }

    static Pending = Pending
    static Resolved = Resolved
    static Rejected = Rejected

    state = {
      loading: true,
      rejected: false,
    }

    getChildContext() {
      return {
        [contextPropName]: {
          ...this.state,
        },
      }
    }

    componentDidMount() {
      invariant(
        isFunction(fn),
        'Function should be passed to createPromiseRenderer as a first argument but got %s.',
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
      fn(params)
        .then(value => this.setState({ loading: false, rejected: false, result: value }))
        .catch(reason => this.setState({ loading: false, rejected: true, rejectReason: reason }))
    }

    render() {
      return (
        this.props.children !== undefined &&
        (isFunction(this.props.children)
          ? this.props.children(this.state.loading, this.state.result, this.state.rejected, this.state.rejectReason)
          : this.props.children)
      )
    }
  }
}

export default createPromiseRenderer
