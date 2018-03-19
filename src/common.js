export const isFunction = value => !!(value && value.constructor && value.call && value.apply)
