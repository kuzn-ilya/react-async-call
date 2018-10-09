# React Async Call

[![npm version][npm-badge]][npm]
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![size][size-badge]][unpkg-dist]
[![gzip size][gzip-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]

Declarative promise handling in React.

## Table of Content
  * [Motivation](#Motivation)
  * [Install](#Install)
  * [Usage](#Usage)
    * [Basic Usage](#Basic-usage)
    * [Data Fetching](#Data-fetching)
    * [Incremental Data Fetching](#Incremental-Data-Fetching)
  * [API Reference](#API-reference)
  * [Change Log](#Change-log)
  * [Credits](#Credits)

## Motivation

Handling promise-returning functions (for example, [`fetch`][fetch-api]) is not hard to do in React application. There are several packages like [holen][holen] or [React Request][react-request] for simplifying such kind of tasks but theirs authors try to impose their own vision on various aspects of data fetching. For instance, [React Request][react-request] has a cache for HTTP requests but what will happen if you decide to change caching strategy? React Async Call tries to sharpen the edges. This is minimalistic package that can be used not only for data fetching but also for handling any promise-returning functions.

## Install

### Using npm

`npm i react-async-call --save`

Then, use it as usual:

```JS
// using ES6 modules
import createAsyncCallComponent from 'react-async-call'

// using CommonJS modules
var createAsyncCallComponent = require('react-async-call').createAsyncCallComponent
```

### UMD build

The UMD build is also available on [unpkg][unpkg]:

```HTML
<script src="https://unpkg.com/react-async-call"></script>
```

The package is avalable on `window.ReactAsyncCall`

## Usage

### Basic Usage

* [JavaScript Example](https://codesandbox.io/s/y7349vl4oj)
* [TypeScript Example](https://codesandbox.io/s/w76rq8jjx8)

```jsx
import createAsyncCallComponent from 'react-async-call'

const AsyncCall = createAsyncCallComponent(value => Promise.resolve(42))

const Example = () => (
  <AsyncCall>
    <AsyncCall.Running>
      <div>Loading...</div>
    </AsyncCall.Running>
    <AsyncCall.Resolved>{({ result }) => <div>The result of function call is {result}</div>}</AsyncCall.Resolved>
    <AsyncCall.Rejected>{({ rejectReason }) => <div>Error: {rejectReason}</div>}</AsyncCall.Rejected>
  </AsyncCall>
)
```

### Data Fetching

* [JavaScript Example](https://codesandbox.io/s/vn8qmr43yy)
* [TypeScript Example](https://codesandbox.io/s/ryxwnkl34)

### Incremental Data Fetching

* [JavaScript Example](https://codesandbox.io/s/mzzvlmj65y)
* [TypeScript Example](https://codesandbox.io/s/5y3m6mrx9p)

# API Reference

## Exported Members

<a name="createAsyncCallComponent"></a>

### `createAsyncCallComponent(fn, [displayName])` ⇒ [<code>AsyncCall</code>](#AsyncCall)
A factory function that creates React component class and binds async operation to it:
```jsx
const Fetcher = createAsyncCallComponent(() => fetch('https://api.github.com/repositories').then(data => data.json()))
```

After calling of this function you can use returned component and its static sub-components to hook async operation lifecycle:

```jsx
// Start executing async operation on Fetcher mount
<Fetcher>
  <Fetcher.Running>
    Renders only if async operation is executing
  </Fetcher.Running>

  <Fetcher.Resolved>
    {({ result }) => (
      <div>
        Renders if async operation has been executed successfully
        <pre>{JSON.stringify(result)}></pre>
      </div>
    )}}
  </Fetcher.Resolved>

  <Fetcher.Rejected>
    Renders only if async operation failed
  </Fetcher.Rejected>
</Fetcher>
```

`createAsyncCallComponent` is the only member exported by react-async-call package.

**Kind**: global function  
**Params**
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | [<code>AsyncFunction</code>](#AsyncFunction) |  | See [`AsyncFunction` signature](#AsyncFunction) for details. |
| [displayName] | <code>String</code> | <code>&quot;AsyncCall&quot;</code> | Component name (visible, for example, in React extension of Chrome Dev Tools). |

**Returns**: [<code>AsyncCall</code>](#AsyncCall) - Returns React [component class `AsyncCall`](#AsyncCall) for the further usage.
This class contains extra component classes [`Running`](#AsyncCall.Running),
[`Rejected`](#AsyncCall.Rejected), [`Resolved`](#AsyncCall.Resolved),
[`Completed`](#AsyncCall.Completed), [`ResultStore`](#AsyncCall.ResultStore),
[`Executor`](#AsyncCall.Executor) and [`State`](#AsyncCall.State) which can be used as children
(direct or indirect) of `AsyncCall`.  

* * *

## React Components

<a name="AsyncCall"></a>

### AsyncCall ⇐ <code>React.Component</code>
React Component. This class is returned by call of [createAsyncCallComponent](#createAsyncCallComponent) and this is the only way to get it.

**Kind**: global class  
**Extends**: <code>React.Component</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| children | <code>ReactNode</code> \| [<code>AsyncCallChildrenFunction</code>](#AsyncCallChildrenFunction) |  | Property `children` can be either a ReactNode or a function that receives an object as its only argument and return ReactNode. `AsyncCall` component **always** renders its children. We recommend to use [the first form of using `children` property](https://github.com/kuzn-ilya/react-async-call/blob/master/README.md#basic-usage) and respond to async operation execution results using *static sub-components* (like [`Running`](#AsyncCall.Running), [`Rejected`](#AsyncCall.Rejected), [`Resolved`](#AsyncCall.Resolved), [`Completed`](#AsyncCall.Completed), [`ResultStore`](#AsyncCall.ResultStore), [`Executor`](#AsyncCall.Executor) and [`State`](#AsyncCall.State)). |
| params | <code>any</code> |  | A value that will be passed as a single argument into async function. Every time when change of this property occurs, asyncronous operation restarts. |
| [lazy] | <code>Boolean</code> | <code>false</code> | If `true`, component will not start execution of asynchronous operation during component mount phase and on `params` property change. You should start async operation manualy by calling [`execute` method](#AsyncCall+execute) or via [`Executor`](#AsyncCall.Executor). |


* [AsyncCall](#AsyncCall) ⇐ <code>React.Component</code>
    * _instance_
        * [`.execute()`](#AsyncCall+execute)
    * _static_
        * [.Completed](#AsyncCall.Completed) ⇐ <code>React.StatelessComponent</code>
        * [.Executor](#AsyncCall.Executor) ⇐ <code>React.StatelessComponent</code>
        * [.Rejected](#AsyncCall.Rejected) ⇐ <code>React.StatelessComponent</code>
        * [.Resolved](#AsyncCall.Resolved) ⇐ <code>React.StatelessComponent</code>
        * [.ResultStore](#AsyncCall.ResultStore) ⇐ <code>React.Component</code>
            * _instance_
                * [`.reset([execute])`](#AsyncCall.ResultStore+reset)
            * _static_
                * [.HasResult](#AsyncCall.ResultStore.HasResult) ⇐ <code>React.StatelessComponent</code>
                * [.Resetter](#AsyncCall.ResultStore.Resetter) ⇐ <code>React.StatelessComponent</code>
        * [.Running](#AsyncCall.Running) ⇐ <code>React.StatelessComponent</code>
        * [.State](#AsyncCall.State) ⇐ <code>React.StatelessComponent</code>


* * *

<a name="AsyncCall+execute"></a>

#### `asyncCall.execute()`
Method for executing async operation manually.
It is recommended to use [`<Executor>` component](#AsyncCall.Executor) instead.

**Kind**: instance method of [<code>AsyncCall</code>](#AsyncCall)  

* * *

<a name="AsyncCall.Completed"></a>

#### AsyncCall.Completed ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children whenever async operation has been completed (successfully or not),
but is still not started again. Otherwise renders nothing.

```jsx
<AsyncCall.Completed>
  Async operation completed
</AsyncCall.Completed>
```

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [children] | <code>ReactNode</code> | React children to be rendered whenever async operation is completed. |


* * *

<a name="AsyncCall.Executor"></a>

#### AsyncCall.Executor ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object
with a function for manual execution of async operation.

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | [<code>ExecutorChildrenFunction</code>](#ExecutorChildrenFunction) | 


* * *

<a name="AsyncCall.Rejected"></a>

#### AsyncCall.Rejected ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children whenever async operation has been completed with failure (promise was rejected),
but is still not started again. Otherwise renders nothing.
Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `rejectReason`
(promise reject reason).

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | <code>ReactNode</code> \| [<code>RejectedChildrenFunction</code>](#RejectedChildrenFunction) | 


* * *

<a name="AsyncCall.Resolved"></a>

#### AsyncCall.Resolved ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children whenever async operation has been completed successfully (promise was resolved),
but is still not started again. Otherwise renders nothing.
Property `children` can be either React node(s) or children function with the only argument receiving object with the only field `result`.

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | <code>ReactNode</code> \| [<code>ResolvedChildrenFunction</code>](#ResolvedChildrenFunction) | 


* * *

<a name="AsyncCall.ResultStore"></a>

#### AsyncCall.ResultStore ⇐ <code>React.Component</code>
React Component. Implements store of results of sequential async calls.
Useful when you need to accumulate results of async calls (e.g., to glue together sequential calls of server API).

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.Component</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| children | [<code>ResultStoreChildrenFunction</code>](#ResultStoreChildrenFunction) \| <code>ReactNode</code> |  | React children or function that returns rendered result depending on `hasResult` flag and `result`. |
| reduce | [<code>ReduceFunction</code>](#ReduceFunction) |  | Function from previousResult and currentResult to a new result. Useful, for example, when you need to accumulate sequential async calls (e.g. for fetching data for infinte page scroll). |
| [initialValue] | <code>any</code> |  | Optional initial value for the result store. If value is provided, result store will have result always. |
| [reset] | <code>boolean</code> | <code>false</code> | @deprecated If `true`, clears the store (**Deprecated, will be removed in version 1.0.0. Use [Resetter](#AsyncCall.ResultStore.Resetter) instead**). |


* [.ResultStore](#AsyncCall.ResultStore) ⇐ <code>React.Component</code>
    * _instance_
        * [`.reset([execute])`](#AsyncCall.ResultStore+reset)
    * _static_
        * [.HasResult](#AsyncCall.ResultStore.HasResult) ⇐ <code>React.StatelessComponent</code>
        * [.Resetter](#AsyncCall.ResultStore.Resetter) ⇐ <code>React.StatelessComponent</code>


* * *

<a name="AsyncCall.ResultStore+reset"></a>

##### `resultStore.reset([execute])`
Resets result store to its intial state.

**Kind**: instance method of [<code>ResultStore</code>](#AsyncCall.ResultStore)  
**Params**
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [execute] | <code>bool</code> | <code>true</code> | Wether execute promise-returning function after resetting or not. |


* * *

<a name="AsyncCall.ResultStore.HasResult"></a>

##### ResultStore.HasResult ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children whenever result store is not empty (has result).
Property `children` must be a function with the only argument receiving object with the only field `result`.

**Kind**: static class of [<code>ResultStore</code>](#AsyncCall.ResultStore)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | [<code>HasResultChildrenFunction</code>](#HasResultChildrenFunction) | 


* * *

<a name="AsyncCall.ResultStore.Resetter"></a>

##### ResultStore.Resetter ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children always. Property `children` must be a function with the only argument receiving an object
with a function for manual reset of [ResultStore](#AsyncCall.ResultStore).

**Kind**: static class of [<code>ResultStore</code>](#AsyncCall.ResultStore)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | [<code>ResetterChildrenFunction</code>](#ResetterChildrenFunction) | 


* * *

<a name="AsyncCall.Running"></a>

#### AsyncCall.Running ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children whenever async operation was started but is still executing. Otherwise renders nothing.

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | <code>ReactNode</code> | 


* * *

<a name="AsyncCall.State"></a>

#### AsyncCall.State ⇐ <code>React.StatelessComponent</code>
React Component. Renders its children always. Property `children` must be a function
with the only argument receiving an object ([see description of `StateChildrenFunction`](#StateChildrenFunction))
with the state of async operation. `State` component is handy for complicated UI cases when none of static components of [AsyncCall](#AsyncCall) suits you.

**Kind**: static class of [<code>AsyncCall</code>](#AsyncCall)  
**Extends**: <code>React.StatelessComponent</code>  
**Properties**

| Name | Type |
| --- | --- |
| children | [<code>StateChildrenFunction</code>](#StateChildrenFunction) | 


* * *

## Function Signatures

<a name="ExecutorChildrenFunction"></a>

### `ExecutorChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [Executor](#AsyncCall.Executor)

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.execute | [<code>ExecuteFunction</code>](#ExecuteFunction) | Function for manual execution of asynchronous operation. |

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="HasResultChildrenFunction"></a>

### `HasResultChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [HasResult](#AsyncCall.ResultStore.HasResult)

**Params**
| Param | Type |
| --- | --- |
| params | <code>object</code> | 
| params.result | <code>any</code> | 

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="RejectedChildrenFunction"></a>

### `RejectedChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [Rejected](#AsyncCall.Rejected)

**Params**
| Param | Type |
| --- | --- |
| params | <code>object</code> | 
| params.rejectReason | <code>any</code> | 

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="ResetFunction"></a>

### `ResetFunction([execute])`
Reset function

**Params**
| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [execute] | <code>bool</code> | <code>false</code> | Wether execute promise-returning function after resetting or not. |


* * *

<a name="ResetterChildrenFunction"></a>

### `ResetterChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [Resetter](#AsyncCall.ResultStore.Resetter)

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.reset | [<code>ResetFunction</code>](#ResetFunction) | Function for manual clearing of [ResultStore](#AsyncCall.ResultStore). |

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="ResolvedChildrenFunction"></a>

### `ResolvedChildrenFunction()` ⇒ <code>ReactNode</code>
Type of children function for [Resolved](#AsyncCall.Resolved)

**Params**
| Param | Type |
| --- | --- |
|  | <code>object</code> | 
| params.result | <code>any</code> | 

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="ResultStoreChildrenFunction"></a>

### `ResultStoreChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of `children` function of a [ResultStore](#AsyncCall.ResultStore) component.

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.hasResult | <code>boolean</code> |  |
| [params.result] | <code>any</code> |  |
| params.reset | [<code>ResetFunction</code>](#ResetFunction) | Function for manual store cleaning. |

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="ReduceFunction"></a>

### `ReduceFunction(previousResult, currentResult)` ⇒ <code>any</code>
Type of `reduce` property of a [ResultStore](#AsyncCall.ResultStore) component.

**Params**
| Param | Type |
| --- | --- |
| previousResult | <code>any</code> | 
| currentResult | <code>any</code> | 


* * *

<a name="StateChildrenFunction"></a>

### `StateChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [State](#AsyncCall.State)

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| params.running | <code>boolean</code> | Whether async opertation is executing or not. If you only need to process `running`, use either [Running](#AsyncCall.Running) or [Completed](#AsyncCall.Completed) component instead. |
| params.resolved | <code>boolean</code> | Whether async opertation was completed successfully last time or not. If you only need to process `resolved` and `result`, [Resolved](#AsyncCall.Resolved) component instead. |
| params.rejected | <code>boolean</code> | Whether async opertation failed last time or not. If you only need to process `rejected` and `rejectedStatus`, use [Rejected](#AsyncCall.Rejected) component instead. |
| [params.rejectReason] | <code>any</code> | Contains reject reason if async opertation failed last time. If you only need to process `rejected` and `rejectedReason`, use [Rejected](#AsyncCall.Rejected) component instead. |
| [params.result] | <code>any</code> | Contains result of last successful async operation call. If you only need to process `resolved` and `result`, use [Resolved](#AsyncCall.Resolved) component instead. If you need to accumulate result, consider [ResultStore](#AsyncCall.ResultStore) usage. |
| params.execute | [<code>ExecuteFunction</code>](#ExecuteFunction) | Callback for manual execution of async operation. If you only need to execute async operation manualy, use [Executor](#AsyncCall.Executor) component instead.                               | |

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

<a name="AsyncFunction"></a>

### `AsyncFunction(params)` ⇒ <code>Promise</code>
Asynchronous function (aka asynchronous operation or promise-returning function)
which returns promise based on supplied parameter.

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>any</code> | Parameters, based on which function should return promise. |

**Returns**: <code>Promise</code> - Promise object that represents asynchronous operation result.  
**Example**  
The function below returns result (`Promise` object) of getting user data from GitHub API by his/her GitHub login:
```
const getGitHubUserData = userName => fetch(`https://api.github.com/users/${userName}`).then(data => data.json())
```

* * *

<a name="ExecuteFunction"></a>

### `ExecuteFunction()` ⇒ <code>void</code>
Execute function


* * *

<a name="AsyncCallChildrenFunction"></a>

### `AsyncCallChildrenFunction(params)` ⇒ <code>ReactNode</code>
Type of children function for [AsyncCall](#AsyncCall)

**Params**
| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | Represents current status of asynchronous operation. |
| params.running | <code>boolean</code> | Indicates whether asynchronous operation is executing or not. |
| params.rejected | <code>boolean</code> | Indicates whether asynchronous operation was failed when it was called last time. If `true`, result of promise rejection (error) can be found in the `params.rejectReason`. |
| params.resolved | <code>boolean</code> | Indicates whether asynchronous operation was succeeded when it was called last time. If `true`, result of promise resolving can be found in the `params.result`. |
| [params.result] | <code>any</code> | Contains result of promise (returned by async function) resolving if function call was successful. `undefined` if asynchronous operation is running or promise was rejected. |
| [params.rejectReason] | <code>any</code> | Contains result of promise (returned by async function) rejection if function call was unsuccessful. `undefined` if asynchronous operation is running or promise was resolved. |
| params.execute | [<code>ExecuteFunction</code>](#ExecuteFunction) | Function for manual execution of asynchronous operation. |

**Returns**: <code>ReactNode</code> - Should return rendered React component(s) depending on supplied params.  

* * *

## Change Log

[You can find change log here][changelog]

## Credits

Great thanks to [@kitos](https://github.com/kitos) and [@ventrz](https://github.com/ventrz) for their invaluable help, support and bright ideas!

[npm-badge]: https://badge.fury.io/js/react-async-call.svg
[npm]: https://www.npmjs.com/package/react-async-call
[build-badge]: https://travis-ci.org/kuzn-ilya/react-async-call.svg?branch=master
[build]: https://travis-ci.org/kuzn-ilya/react-async-call
[coverage-badge]: https://codecov.io/gh/kuzn-ilya/react-async-call/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/kuzn-ilya/react-async-call
[license-badge]: https://img.shields.io/npm/l/react-async-call.svg
[license]: https://github.com/kuzn-ilya/react-async-call/blob/master/LICENSE
[size-badge]: http://img.badgesize.io/https://unpkg.com/react-async-call/lib/index.umd.js?label=size
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/react-async-call/lib/index.umd.js?compression=gzip&label=gzip%20size
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg
[unpkg-dist]: https://unpkg.com/react-async-call/lib/
[unpkg]: https:/unpkg.com
[changelog]: https://github.com/kuzn-ilya/react-async-call/blob/master/docs/CHANGELOG.md
[fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[holen]: https://github.com/tkh44/holen
[react-request]: https://github.com/jamesplease/react-request