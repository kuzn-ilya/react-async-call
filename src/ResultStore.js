import * as React from 'react'
import * as PropTypes from 'prop-types'
import createContext from 'create-react-context'
import { polyfill } from 'react-lifecycles-compat'
import {
  createAsyncCallChild,
  renderChildren,
  renderChildrenFn,
  invariant,
  warning,
  INVARIANT_MUST_BE_A_CHILD,
  requiredFuncPropType,
  WARNING_PROPERTY_RESET_IS_DEPRECATED,
  DISPLAY_NAME_HAS_RESULT,
  DISPLAY_NAME_RESETTER,
} from './utils'

const INITIAL_VALUE_PROP_NAME = 'initialValue'

export const createResultStore = (RootConsumer, rootDisplayName) => {
  const { Consumer, Provider } = createContext()

  class Internal extends React.Component {
    state = {
      hasResult: false,
      wasResolved: this.props.resolved,
    }

    componentDidMount() {
      const props = this.props
      const { resolved } = props
      if (resolved || props.hasOwnProperty(INITIAL_VALUE_PROP_NAME)) {
        this.setState({
          hasResult: true,
          result: resolved ? props.result : props.initialValue,
          wasResolved: resolved,
        })
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { resolved, reset } = nextProps
      if (reset) {
        return { ...getResetState(nextProps), wasResolved: resolved }
      }

      if (resolved && !prevState.wasResolved) {
        if (prevState.hasResult) {
          return {
            result: nextProps.reduce(prevState.result, nextProps.result),
            wasResolved: resolved,
          }
        }
        return {
          hasResult: true,
          result: nextProps.result,
          wasResolved: resolved,
        }
      }

      if (resolved !== prevState.wasResolved) {
        return {
          wasResolved: resolved,
        }
      }
      return null
    }

    render() {
      const state = this.state
      const props = this.props
      const value = {
        hasResult: state.hasResult,
        reset: props.resetFn,
        ...(state.hasResult ? { result: state.result } : {}),
      }

      return <Provider value={value}>{renderChildren(props, value)}</Provider>
    }

    reset = execute => {
      this.setState(getResetState(this.props))
      if (execute) {
        execute()
      }
    }
  }

  const getResetState = props =>
    props.hasOwnProperty(INITIAL_VALUE_PROP_NAME)
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
            warning(!this.props.hasOwnProperty('reset'), WARNING_PROPERTY_RESET_IS_DEPRECATED)
            this._execute = context.execute

            return (
              <ResultStoreInternal ref={ref => (this.ref = ref)} resetFn={this.reset} {...this.props} {...context} />
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
  }
  ResultStore.Consumer = Consumer

  /**
   * Type of children function for {@link AsyncCall.ResultStore.HasResult}
   * @function HasResultChildrenFunction
   * @param {object} params
   * @param {any} params.result
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class HasResult
   * @classdesc
   * React Component. Renders its children whenever result store is not empty (has result).
   * Property `children` must be a function with the only argument receiving object with the only field `result`.
   * @example
   * ```jsx
   * <AsyncCall.ResultStore.HasResult>{({result}) => <pre>{JSON.stringify(result)}</pre>}</AsyncCall.ResultStore.HasResult>
   * ```
   * @property {HasResultChildrenFunction} children
   * @static
   * @extends {React.StatelessComponent}
   * @memberof AsyncCall.ResultStore
   */
  ResultStore.HasResult = createAsyncCallChild(
    Consumer,
    ResultStore.displayName,
    (props, contextProps) => contextProps.hasResult && renderChildrenFn(props, { result: contextProps.result }),
    DISPLAY_NAME_HAS_RESULT,
    requiredFuncPropType,
  )

  /**
   * Reset function
   * @function ResetFunction
   * @param {bool} [execute=false] Wether execute promise-returning function after resetting or not.
   * @remark type definition
   */

  /**
   * Type of children function for {@link AsyncCall.ResultStore.Resetter}
   * @function ResetterChildrenFunction
   * @param {object} params
   * @param {ResetFunction} params.reset Function for manual clearing of {@link AsyncCall.ResultStore}.
   * @returns {ReactNode} Should return rendered React component(s) depending on supplied params.
   * @remark type definition
   */

  /**
   * @class Resetter
   * @classdesc
   * React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object
   * with a function for manual reset of {@link AsyncCall.ResultStore}.
   * @example
   * ```jsx
   * <AsyncCall.ResultStore.Resetter>{({ reset }) => <button onClick={reset}>Reset</button>}</AsyncCall.ResultStore.Resetter>
   * ```
   * @property {ResetterChildrenFunction} children
   * @static
   * @extends {React.StatelessComponent}
   * @memberof AsyncCall.ResultStore
   */
  ResultStore.Resetter = createAsyncCallChild(
    Consumer,
    ResultStore.displayName,
    (props, contextProps) => renderChildrenFn(props, { reset: contextProps.reset }),
    DISPLAY_NAME_RESETTER,
    requiredFuncPropType,
  )

  return ResultStore
}
