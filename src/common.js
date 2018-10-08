import * as PropTypes from 'prop-types'

export const isFunction = value => !!(value && value.constructor && value.call && value.apply)

let contextCounter = 1

export const generateContextName = () => `__react-async-call__${contextCounter++}`

export const resultStoreContextPropType = PropTypes.shape({
  hasResult: PropTypes.bool,
  result: PropTypes.any,
  reset: PropTypes.func,
})
