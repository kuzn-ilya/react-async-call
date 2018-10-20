import * as React from 'react'
import * as PropTypes from 'prop-types'
// TODO: Remove `warning` dependency after getting rid of `create-react-context`
import warning from 'fbjs/lib/warning'
import shallowEqual from 'fbjs/lib/shallowEqual'

export const isFunction = value => !!(value && value.constructor && value.call && value.apply)

export const renderChildren = ({ children, ...arg }) => (isFunction(children) ? children(arg) : children)

export const createAsyncCallChildFactory = (renderFn, childrenPropType, displayName) => (Consumer, rootDisplayName) => {
  const Child = props => (
    <Consumer>
      {contextProps => {
        invariant(contextProps, INVARIANT_MUST_BE_A_CHILD, Child.displayName, rootDisplayName)

        return renderFn({ ...props, ...contextProps }) || null
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
export let INVARIANT_COMPONENT_WAS_ALREADY_REGISTERED
export let WARNING_PROPERTY_RESET_IS_DEPRECATED

if (process.env.NODE_ENV !== 'production') {
  nodePropType = PropTypes.node
  requiredFuncPropType = PropTypes.func.isRequired
  nodeOrFuncPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  INVARIANT_MUST_BE_A_CHILD = '<%s> must be a child (direct or indirect) of <%s>.'
  INVARIANT_FUNCTION_SHOULD_BE_PASSED =
    'Function should be passed to createAsyncCallComponent as a first argument but got %s.'
  INVARIANT_FUNCTION_SHOULD_RETURN_PROMISE =
    'Function supplied to "createAsyncCallComponent" function should return a promise.'
  INVARIANT_COMPONENT_WAS_ALREADY_REGISTERED = 'Component `%s` was already registered.'
  WARNING_PROPERTY_RESET_IS_DEPRECATED =
    'Property `reset` of <AsyncCall.ResultStore> component is deprecated. Use <AsyncCall.ResultStore.Resetter> component instead.'
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
