import * as React from 'react'
import * as PropTypes from 'prop-types'
import shallowEqual from 'fbjs/lib/shallowEqual'
import invariant from 'fbjs/lib/invariant'

const isFunction = value => !!(value && value.constructor && value.call && value.apply)

let counter = 1

export const createPromiseRenderer = (fn, displayName) => {
  const contextPropName = `__react-promise-renderer__${counter++}`
  const rootDisplayName = `${displayName || 'PromiseRenderer'}`

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

  return class extends React.Component {
    static childContextTypes = {
      [contextPropName]: PropTypes.shape({
        running: PropTypes.bool,
        rejected: PropTypes.bool,
        resolved: PropTypes.bool,
        rejectReason: PropTypes.any,
        result: PropTypes.any,
        execute: PropTypes.func,
      }),
    }

    static propTypes = {
      params: PropTypes.any.isRequired,
      mergeResult: PropTypes.func,
    }

    static defaultProps = {
      mergeResult: (_, currentResult) => currentResult,
    }

    static displayName = rootDisplayName

    static Running = Running
    static Resolved = Resolved
    static Rejected = Rejected
    static Executor = Executor
    static Result = Result

    state = {
      running: true,
      rejected: false,
      resolved: false,
      hasResult: false,
    }

    getChildContext() {
      return {
        [contextPropName]: {
          ...this.state,
          execute: this.execute,
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
      this.setState({ running: true, rejected: false, resolved: false, rejectReason: undefined })
      const promise = fn(params)
      invariant(
        promise && promise.then && isFunction(promise.then),
        'Function supplied to "createPromiseRenderer" function should return a promise.',
      )
      promise
        .then(value =>
          this.setState({
            running: false,
            rejected: false,
            resolved: true,
            hasResult: true,
            result: this.state.hasResult ? this.props.mergeResult(this.state.result, value) : value,
          }),
        )
        .catch(reason => this.setState({ running: false, rejected: true, rejectReason: reason }))
    }

    execute = () => {
      this.callQueryFunc()
    }

    render() {
      return (
        this.props.children !== undefined &&
        (isFunction(this.props.children)
          ? this.props.children({
              ...this.state,
              execute: this.execute,
            })
          : this.props.children)
      )
    }
  }
}

export default createPromiseRenderer
