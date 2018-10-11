import * as React from 'react'
import * as PropTypes from 'prop-types'
import createContext from 'create-react-context'
import { polyfill } from 'react-lifecycles-compat'
import { isFunction, invariant, warning, INVARIANT_MUST_BE_A_CHILD } from './common'
import { createHasResult } from './HasResult'
import { createResetter } from './Resetter'

export const createResultStore = (RootConsumer, rootDisplayName) => {
  const { Consumer, Provider } = createContext()

  class Internal extends React.Component {
    state = {
      hasResult: false,
      wasResolved: this.props.resolved,
    }

    componentDidMount() {
      if (this.props.resolved || this.props.hasOwnProperty('initialValue')) {
        this.setState({
          hasResult: true,
          result: this.props.resolved ? this.props.result : this.props.initialValue,
          wasResolved: this.props.resolved,
        })
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.reset) {
        return { ...getResetState(nextProps), wasResolved: nextProps.resolved }
      }

      if (nextProps.resolved && !prevState.wasResolved) {
        if (prevState.hasResult) {
          return {
            result: nextProps.reduce(prevState.result, nextProps.result),
            wasResolved: nextProps.resolved,
          }
        }
        return {
          hasResult: true,
          result: nextProps.result,
          wasResolved: nextProps.resolved,
        }
      }

      if (nextProps.resolved !== prevState.wasResolved) {
        return {
          wasResolved: nextProps.resolved,
        }
      }
      return null
    }

    render() {
      return (
        <Provider value={this._getState()}>
          {(isFunction(this.props.children) ? this.props.children(this._getState()) : this.props.children) || null}
        </Provider>
      )
    }

    _getState() {
      const result = this.state.hasResult ? { result: this.state.result } : {}
      return {
        hasResult: this.state.hasResult,
        reset: this.props.resetFn,
        ...result,
      }
    }

    reset = execute => {
      this.setState(getResetState(this.props))
      if (execute) {
        execute()
      }
    }
  }

  const getResetState = props =>
    props.hasOwnProperty('initialValue')
      ? { hasResult: true, result: props.initialValue }
      : {
          hasResult: false,
        }

  if (process.env.NODE_ENV !== 'production') {
    Internal.propTypes = {
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
      reduce: PropTypes.func,
      reset: PropTypes.bool,
      initialValue: PropTypes.any,
      resolved: PropTypes.bool,
      result: PropTypes.any,
      resetFn: PropTypes.func.isRequired,
    }
  }

  const ResultStoreInternal = polyfill(Internal)

  /**
   * Type of `children` function of a {@link AsyncCall.ResultStore} component.
   * @function ResultStoreChildrenFunction
   * @param {object} params
   * @param {boolean} params.hasResult
   * @param {any=} params.result
   * @param {ResetFunction} params.reset Function for manual store cleaning.
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * Type of `reduce` property of a {@link AsyncCall.ResultStore} component.
   * @function ReduceFunction
   * @param {any} previousResult
   * @param {any} currentResult
   * @returns {any}
   * @remark type definition
   */

  /**
   * @class
   * @classdesc
   * React Component. Implements store of results of sequential async calls.
   * Useful when you need to accumulate results of async calls (e.g., to glue together sequential calls of server API).
   * @example
   * ```jsx
   * const concatResults = (previousResult, currentResult) => [...previousResult, ...currentResult]
   *
   * ...
   *
   * <AsyncCall params={{ page: this.state.page }}>
   *   <AsyncCall.ResultStore reduce={concatResults} reset={this.state.page === 0}>
   *     <AsyncCall.ResultStore.HasResult>
   *       {({ result }) => <pre>{JSON.stringify(result)}</pre>}
   *     </AsyncCall.ResultStore.HasResult>
   *   </AsyncCall.ResultStore>
   *   <button onClick={() => this.setState(({ page }) => ({ page: page + 1}))}>
   *     Load more
   *   </button>
   *   <button onClick={() => this.setState({ page: 0 })}>
   *     Reload
   *   </button>
   * </AsyncCall>
   * ```
   * @property {ResultStoreChildrenFunction | ReactNode} children React children or function that returns rendered result
   * depending on `hasResult` flag and `result`.
   * @property {ReduceFunction} reduce Function from previousResult and currentResult to a new result.
   * Useful, for example, when you need to accumulate sequential async calls
   * (e.g. for fetching data for infinte page scroll).
   * @property {any=} initialValue Optional initial value for the result store. If value is provided, result store will have result always.
   * @property {boolean} [reset=false] @deprecated If `true`, clears the store (**Deprecated, will be removed in version 1.0.0. Use {@link AsyncCall.ResultStore.Resetter} instead**).
   * @static
   * @extends {React.Component}
   * @memberof AsyncCall
   */
  class ResultStore extends React.Component {
    static defaultProps = {
      reduce: (_, value) => value,
    }

    render() {
      return (
        <RootConsumer>
          {context => {
            invariant(context, INVARIANT_MUST_BE_A_CHILD, ResultStore.displayName, rootDisplayName)
            warning(
              !this.props.hasOwnProperty('reset'),
              'Property `reset` of <AsyncCall.ResultStore> component is deprecated. Use <AsyncCall.ResultStore.Resetter> component instead.',
            )
            this._execute = context.execute

            const { children, ...rest } = this.props

            return (
              <ResultStoreInternal ref={ref => (this.ref = ref)} resetFn={this.reset} {...rest} {...context}>
                {children}
              </ResultStoreInternal>
            )
          }}
        </RootConsumer>
      )
    }

    /**
     * Resets result store to its initial state.
     * @method
     * @param {bool} [execute=true] Wether execute promise-returning function after resetting or not.
     */
    reset = (execute = true) => {
      this.ref.reset(execute && this._execute)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    ResultStore.propTypes = {
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
      reduce: PropTypes.func,
      reset: PropTypes.bool,
      initialValue: PropTypes.any,
    }
    ResultStore.displayName = `${rootDisplayName}.ResultStore`
    ResultStore.Consumer = Consumer
  }
  ResultStore.HasResult = createHasResult(Consumer, ResultStore.displayName)
  ResultStore.Resetter = createResetter(Consumer, ResultStore.displayName)

  return ResultStore
}
