import * as PropTypes from 'prop-types'

export const isFunction = value => !!(value && value.constructor && value.call && value.apply)

export const resultStoreContextPropName = 'resultStore'

export const resultStoreContextPropType = PropTypes.shape({
  [resultStoreContextPropName]: PropTypes.shape({
    hasResult: PropTypes.bool,
    result: PropTypes.any,
  }),
})
