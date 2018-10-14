import * as React from 'react'

export const flushPromises = () => new Promise(resolve => setImmediate(resolve))

const isSupportContextApi = !!React.createContext

export const getAsyncCallChildrenContainer = asyncCall => (isSupportContextApi ? asyncCall : asyncCall.childAt(0))

export const getChildrenContainer = (wrapper, type) =>
  isSupportContextApi
    ? wrapper.find(type)
    : wrapper
        .childAt(0)
        .find(type)
        .childAt(0)

export const getResultStoreChildrenContainer = (wrapper, type) =>
  isSupportContextApi
    ? wrapper.find(type)
    : wrapper
        .childAt(0)
        .find(type)
        .childAt(0)

export const MINIFIED_INVARIANT_MESSAGE =
  'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
