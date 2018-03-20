# createAsyncCallComponent

A factory function that creates React component class and binds async operation to it:

```jsx
const Fetcher = createAsyncCallComponent(() => fetch('https://api.github.com/repositories').then(data => data.json()))
```

After calling this function you can use returned component and its [static sub-components](#static-props) to hook async operation lifecycle:

```jsx
// Start executing async operation on Fetcher mount
<Fetcher>
  <Fetcher.Running>Renders only if async operation is executing</Fetcher.Running>

  <Fetcher.Result>
    {/* Renders if async operation has been executed successfully at least once: */}
    {result =>
      <pre>{JSON.stringify(result)></pre>
    }}
  </Fetcher.Result>
  <Fetcher.Rejected>Renders only if async operation failed</Fetcher.Rejected>
</Fetcher>
```

`createAsyncCallComponent` is the only member exported by react-async-call package.

## params

### fn

**Type:** `(params: Params) => Promise<Result>`

**Optional:** No

Function which returns promise by provided params. Calling this function starts async operations.

```jsx
const Fetcher = createAsyncCallComponent(since =>
  fetch(`https://api.github.com/repositories?since=${since}`).then(data => data.json()),
)
```

### displayName

**Type:** `string`

**Optional:** Yes

**Default Value:** `'AsyncCall'`

Component name (visible, for example, in React extension of Chrome Dev Tools).

## returns

Returns React component class `AsyncCall` for the further usage. This class contains extra component classes [`Running`](#running), [`Rejected`](#rejected), [`Resolved`](#resolved), [`HasResult`](#hasresult) and [`Executor`](#executor) which can be used as children (direct or indirect) of `AsyncCall`.

# AsyncCall component

## Static Props

### Running

React Component. Renders its children whenever async operation was started but is still executing. Otherwise renders nothing.

```jsx
<AsyncCall.Running>Executing...</AsyncCall.Running>
```

### Resolved

React Component. Renders its children whenever async operation has been completed successfully (promise was resolved), but is not started again. Otherwise renders nothing:

```jsx
<AsyncCall.Resolved>Last async operation was successful!</AsyncCall.Resolved>
```

### Rejected

React Component. Renders its children whenever async operation has been completed with failure (promise was rejected), but is not started again. Otherwise renders nothing.

Property `children` can be either React node(s) or children function with the only argument receiving promise reject reason:

```jsx
<AsyncCall.Rejected>Error!</AsyncCall.Rejected>
```

or

```jsx
<AsyncCall.Rejected>{reason => Error: {reason}}</AsyncCall.Rejected>
```

### HasResult

React Component. Renders its children whenever at least one of the previous async operations has been completed successfully.

Property `children` must be a function with the only argument receiving result of async operation:

```jsx
<AsyncCall.HasResult>{result => Error:{reason}}</AsyncCall.HasResult>
```

### Executor

React Component. Renders its children always. Property `children` must be a function with the only argument receiving a function for manual execution of async operation:

```jsx
<AsyncCall.Executor>{execute => <button onClick={execute}>Click me!</button>}</AsyncCall.Executor>
```

## Props

### children

**Type:** `React.ReactNode | (object) => React.Node`

Property `children` can be either a ReactNode or a function that receives an object as its only argument and return ReactNode. `AsyncCall` component **always** renders its children. We recommend to use [the first form of using `children` property](https://github.com/kuzn-ilya/react-async-call/blob/master/README.md#declarative) and respond to async operation execution results using [static sub-components](#static-props) ([`Running`](#running), [`HasResult`](#hasresult), [`Rejected`](#rejected) etc.):

### params

**Type:** `Params`

**Optional:** No

A single argument which will be passed into async function

### mergeResult

**Type:** `(previousResult: Result, currentResult: Result) => Result`

**Optional:** Yes

**Default Value:** `(_, result) => result`

Function from previousResult and currentResult to a new result. Useful, for example, when you need to accumulate sequential async calls (e.g. for fetching data for infinte page scroll).

## Methods

### execute

**Type:** `() => void`

Method for running async operation manually.
