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

  <Fetcher.Resolved>
    {/* Renders if async operation has been executed successfully: */}
    {({ result }) => <pre>{JSON.stringify(result)}></pre>}}
  </Fetcher.Resolved>
  <Fetcher.Rejected>Renders only if async operation failed</Fetcher.Rejected>
</Fetcher>
```

`createAsyncCallComponent` is the only member exported by react-async-call package.

## params

### fn

|              |                                       |
| :----------- | :------------------------------------ |
| **Type**     | `(params: Params) => Promise<Result>` |
| **Optional** | No                                    |

Function (aka asyncronous operation) which returns promise by provided params.

```jsx
const Fetcher = createAsyncCallComponent(since =>
  fetch(`https://api.github.com/repositories?since=${since}`).then(data => data.json()),
)
```

### displayName

|                   |               |
| :---------------- | :------------ |
| **Type**          | `string`      |
| **Optional**      | Yes           |
| **Default Value** | `'AsyncCall'` |

Component name (visible, for example, in React extension of Chrome Dev Tools).

## returns

|          |                        |
| :------- | :--------------------- |
| **Type** | `React.ComponentClass` |

Returns React [component class `AsyncCall`](#asynccall-component) for the further usage. This class contains extra component classes [`Running`](#running), [`Rejected`](#rejected), [`Resolved`](#resolved), [`Completed`](#completed), [`ResultStore`](#resultstore), [`Executor`](#executor) and [`State`](#state) which can be used as children (direct or indirect) of `AsyncCall`.

# AsyncCall component

## Static Props

### Running

React Component. Renders its children whenever async operation was started but is still executing. Otherwise renders nothing.

```jsx
<AsyncCall.Running>Executing...</AsyncCall.Running>
```

### Resolved

React Component. Renders its children whenever async operation has been completed successfully (promise was resolved), but is still not started again. Otherwise renders nothing.

Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `result`.

```jsx
<AsyncCall.Resolved>Last async operation was successful!</AsyncCall.Resolved>
```

or

```jsx
<AsyncCall.Resolved>{({ result }) => <pre>{JSON.stringify(result)}</pre>}</AsyncCall.Resolved>
```

### Rejected

React Component. Renders its children whenever async operation has been completed with failure (promise was rejected), but is still not started again. Otherwise renders nothing.

Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `rejectReason` (promise reject reason).

```jsx
<AsyncCall.Rejected>Error!</AsyncCall.Rejected>
```

or

```jsx
<AsyncCall.Rejected>{({ rejectReason }) => Error: {rejectReason}}</AsyncCall.Rejected>
```

### Completed

React Component. Renders its children whenever async operation has been completed (successfully or not), but is still not started again. Otherwise renders nothing.

```jsx
<AsyncCall.Completed>Error!</AsyncCall.Completed>
```

### Executor

React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object with a function for manual execution of async operation.

```jsx
<AsyncCall.Executor>{({ execute }) => <button onClick={execute}>Click me!</button>}</AsyncCall.Executor>
```

### ResultStore

React Component. Implements store of results of sequential async calls. Useful when you need to accumulate results of async calls (e.g., to glue together sequential calls of server API). 

| Property | Type | Description |
| :------- | :--- | :---------- |
| `children` | `({ hasResult: boolean, result: Result }) => React.ReactNode` or `React.ReactNode` | React children or function that returns rendered result depending on `hasResult` flag and `result`. |
| `reduce` | `(accumulator: Result, current: Result) => Result` | Reducer function. |
| `initialValue` | `Result` | Optional initial value for the result store. If value is provided, result store will have result always. |
| `reset` | `boolean` | If `true`, clears the store. |

#### Example

```jsx
const concatResults = (previousResult, currentResult) => [...previousResult, ...currentResult]

...

<AsyncCall params={{ page: this.state.page }}>
  <AsyncCall.ResultStore reduce={concatResults} reset={this.state.page === 0}>
    <AsyncCall.ResultStore.HasResult>
       {({ result }) => <pre>{JSON.stringify(result)}</pre>}
    </AsyncCall.ResultStore.HasResult>
  </AsyncCall.ResultStore>
  <button onClick={() => this.setState(({ page }) => ({ page: page + 1}))}>
    Load more
  </button>
  <button onClick={() => this.setState({ page: 0 })}>
    Reload
  </button>
</AsyncCall>
```


### ResultStore.HasResult

React Component. Renders its children whenever result store is not empty (has result).

Property `children` must be a function with the only argument receiving object with the only field `result`.

```jsx
<AsyncCall.ResultStore.HasResult>{({result}) => <pre>{JSON.stringify(result)}</pre>}</AsyncCall.ResultStore.HasResult>
```

### State

React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object ([see below](#state-children-function-argument-properties)) with the state of async operation. `State` component is handy for complicated UI cases when none of components above suits you.

```jsx
<AsyncCall.State>
  {({ running, resolved, result, rejected, rejectReason, execute }) => {
    /* Something that depends on all of the received object properties */
  }}
</AsyncCall.State>
```

#### State children function argument properties

| Name         | Type         | Description                                                                                                                                                                           |
| :----------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| running      | `boolean`    | Whether async opertation is executing or not. If you only need to process `running`, use either [`<Running>`](#running) or [`<Completed>`](#completed) component instead. |
| resolved     | `boolean`    | Whether async opertation was completed successfully last time or not. If you only need to process `resolved` and `result`, use [`<Resolved>`](#resolved) component instead. |
| rejected     | `boolean`    | Whether async opertation failed last time or not. If you only need to process `rejected` and `rejectedStatus`, use [`<Rejected>`](#rejected) component instead.                       |
| rejectReason | `any`        | Contains reject reason if async opertation failed last time. If you only need to process `rejected` and `rejectedReason`, use [`<Rejected>`](#rejected) component instead.             |
| result       | `Result`     | Contains result of last successful async operation call. If you only need to process `resolved` and `result`, use [`<Resolved>`](#resolved) component instead. If you need to accumulate result, consider [`<ResultStore>`](#resultstore) usage. |
| execute      | `() => void` | Callback for manual execution of async operation. If you only need to execute async operation manualy, use [`<Executor>`](#executor) component instead.                               |


## Props

### children

|              |                                          |
| :----------- | :--------------------------------------- |
| **Type**     | `React.ReactNode|(object) => React.Node` |
| **Optional** | No                                       |

Property `children` can be either a ReactNode or a function that receives an object as its only argument and return ReactNode. `AsyncCall` component **always** renders its children. We recommend to use [the first form of using `children` property](https://github.com/kuzn-ilya/react-async-call/blob/master/README.md#basic-usage) and respond to async operation execution results using [static sub-components](#static-props) ([`Running`](#running), [`Resolved`](#resolved), [`Rejected`](#rejected) etc.):

### params

|              |          |
| :----------- | :------- |
| **Type**     | `Params` |
| **Optional** | No       |

A single argument which will be passed into async function.

### mergeResult

|                   |                                                             |
| :---------------- | :---------------------------------------------------------- |
| **Type**          | `(previousResult: Result, currentResult: Result) => Result` |
| **Optional**      | Yes                                                         |
| **Default Value** | `(_, result) => result`                                     |

Function from previousResult and currentResult to a new result. Useful, for example, when you need to accumulate sequential async calls (e.g. for fetching data for infinte page scroll).

## Methods

### execute

|          |              |
| :------- | :----------- |
| **Type** | `() => void` |

Method for executing async operation manually. It is recommended to use [`<Executor>` component](#executor) instead.
