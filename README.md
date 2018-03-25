# react-async-call

[![npm version](https://badge.fury.io/js/react-async-call.svg)](https://badge.fury.io/js/react-async-call)
[![Build Status](https://travis-ci.org/kuzn-ilya/react-async-call.svg?branch=master)](https://travis-ci.org/kuzn-ilya/react-async-call.svg)
[![codecov](https://codecov.io/gh/kuzn-ilya/react-async-call/branch/master/graph/badge.svg)](https://codecov.io/gh/kuzn-ilya/react-async-call)

## Overview

Declarative promise handling in React.

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

The UMD build is also available on [unpkg](https:/unpkg.com):

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
    <AsyncCall.HasResult>{result => <div>The result of function call is {result}</div>}</AsyncCall.HasResult>
    <AsyncCall.Rejected>{reason => <div>Error: {reason}</div>}</AsyncCall.Rejected>
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

[See API reference here](https://github.com/kuzn-ilya/react-async-call/blob/master/docs/API.md)

## Change Log

[You can find change log here](https://github.com/kuzn-ilya/react-async-call/blob/master/docs/CHANGELOG.md)

## Credits

Great thanks to [@kitos](https://github.com/kitos) and [@ventrz](https://github.com/ventrz) for their invaluable help, support and bright ideas!
