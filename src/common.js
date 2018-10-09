import * as PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import warning from 'fbjs/lib/warning'
import shallowEqual from 'fbjs/lib/shallowEqual'

export const isFunction = value => !!(value && value.constructor && value.call && value.apply)

let contextCounter = 1

export const generateContextName = () => `__react-async-call__${contextCounter++}`

export const resultStoreContextPropType = PropTypes.shape({
  hasResult: PropTypes.bool,
  result: PropTypes.any,
  reset: PropTypes.func.isRequired,
})

export const INVARIANT_MUST_BE_A_CHILD = '<%s> must be a child (direct or indirect) of <%s>.'

export { warning, invariant, shallowEqual }
