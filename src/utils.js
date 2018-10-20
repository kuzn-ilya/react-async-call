import * as React from 'react'
import * as PropTypes from 'prop-types'
// TODO: Remove `warning` dependency after getting rid of `create-react-context`
import warning from 'fbjs/lib/warning'
import shallowEqual from 'fbjs/lib/shallowEqual'

export const isFunction = value => !!(value && value.constructor && value.call && value.apply)

export const renderChildren = ({ children }, arg) => (isFunction(children) ? children(arg) : children) || null

export const renderChildrenFn = ({ children }, arg) => (isFunction(children) && children(arg)) || null

export const createAsyncCallChild = (Consumer, rootDisplayName, renderFn, displayName, childrenPropType) => {
  const Child = props => (
    <Consumer>
      {contextProps => {
        invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Child.displayName, rootDisplayName)

        return renderFn(props, contextProps) || null
      }}
    </Consumer>
  )

  if (process.env.NODE_ENV !== 'production') {
    Child.propTypes = {
      children: childrenPropType,
    }

    Child.displayName = `${rootDisplayName}.${displayName}`
  }

  return Child
}

export let nodePropType
export let requiredFuncPropType
export let nodeOrFuncPropType
export let INVARIANT_MUST_BE_A_CHILD
export let INVARIANT_FUNCTION_SHOULD_BE_PASSED
export let INVARIANT_FUNCTION_SHOULD_RETURN_PROMISE
export let WARNING_PROPERTY_RESET_IS_DEPRECATED

export let DISPLAY_NAME_ASYNC_CALL
export let DISPLAY_NAME_COMPLETED
export let DISPLAY_NAME_EXECUTOR
export let DISPLAY_NAME_REJECTED
export let DISPLAY_NAME_RESOLVED
export let DISPLAY_NAME_RESULT_STORE
export let DISPLAY_NAME_RUNNING
export let DISPLAY_NAME_STATE
export let DISPLAY_NAME_RESETTER
export let DISPLAY_NAME_HAS_RESULT

if (process.env.NODE_ENV !== 'production') {
  nodePropType = PropTypes.node
  requiredFuncPropType = PropTypes.func.isRequired
  nodeOrFuncPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  INVARIANT_MUST_BE_A_CHILD = '<%s> must be a child (direct or indirect) of <%s>.'
  INVARIANT_FUNCTION_SHOULD_BE_PASSED =
    'Function should be passed to createAsyncCallComponent as a first argument but got %s.'
  INVARIANT_FUNCTION_SHOULD_RETURN_PROMISE =
    'Function supplied to "createAsyncCallComponent" function should return a promise.'
  WARNING_PROPERTY_RESET_IS_DEPRECATED =
    'Property `reset` of <AsyncCall.ResultStore> component is deprecated. Use <AsyncCall.ResultStore.Resetter> component instead.'

  DISPLAY_NAME_COMPLETED = 'Completed'
  DISPLAY_NAME_EXECUTOR = 'Executor'
  DISPLAY_NAME_REJECTED = 'Rejected'
  DISPLAY_NAME_RESOLVED = 'Resolved'
  DISPLAY_NAME_RESULT_STORE = 'ResultStore'
  DISPLAY_NAME_RUNNING = 'Running'
  DISPLAY_NAME_STATE = 'State'
  DISPLAY_NAME_RESETTER = 'Resetter'
  DISPLAY_NAME_HAS_RESULT = 'HasResult'
}

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

export function invariant(condition, format, a, b, c, d, e, f) {
  if (!condition) {
    var error
    if (process.env.NODE_ENV === 'production') {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.',
      )
    } else {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument')
      }
      var args = [a, b, c, d, e, f]
      var argIndex = 0
      error = new Error(
        format.replace(/%s/g, function() {
          return args[argIndex++]
        }),
      )
      error.name = 'Invariant Violation'
    }

    error.framesToPop = 1 // we don't care about invariant's own frame
    throw error
  }
}

export { warning, shallowEqual }
