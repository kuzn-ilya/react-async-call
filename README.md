# React Async Call

[![npm version][npm-badge]][npm]
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![size][size-badge]][unpkg-dist]
[![gzip size][gzip-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]

## Overview

Declarative promise handling in React.

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

## API

[See API reference here][api]

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
[api]: https://github.com/kuzn-ilya/react-async-call/blob/master/docs/API.md
[fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[holen]: https://github.com/tkh44/holen
[react-request]: https://github.com/jamesplease/react-request