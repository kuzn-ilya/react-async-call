export const flushPromises = () => new Promise(resolve => setImmediate(resolve))

export const getAsyncCallChildrenContainer = asyncCall => asyncCall

export const getChildrenContainer = (wrapper, type) => wrapper.find(type)

export const getResultStoreChildrenContainer = (wrapper, type) => wrapper.find(type)
