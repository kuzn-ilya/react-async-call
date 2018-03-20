# react-async-call

[![npm version](https://badge.fury.io/js/react-async-call.svg)](https://badge.fury.io/js/react-async-call)
[![Build Status](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg?branch=master)](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg)
[![codecov](https://codecov.io/gh/kuzn-ilya/react-promise-renderer/branch/master/graph/badge.svg)](https://codecov.io/gh/kuzn-ilya/react-promise-renderer)

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

[![Basic Usage](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y7349vl4oj)

```jsx
import createAsyncCallComponent from 'react-async-call'

const AsyncCall = createAsyncCallComponent(value => Promise.resolve(42))

const Example = () => (
  <AsyncCall>
    <AsyncCall.Running>
      <div>Loading...</div>
    </AsyncCall.Running>
    <AsyncCall.Result>{result => <div>The result of function call is {result}</div>}</AsyncCall.Result>
    <AsyncCall.Rejected>{reason => <div>Error: {reason}</div>}</AsyncCall.Rejected>
  </AsyncCall>
)
```

### Data Fetching

[![Data Fetching](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vn8qmr43yy)

### Incremental Data Fetching

[![Incremental Data Fetching](https://codesandbox.io/s/718o3lpnmx)](https://codesandbox.io/s/mzzvlmj65y)

## API

[See API reference here](https://github.com/kuzn-ilya/react-promise-renderer/blob/master/docs/API.md)

## Change Log

[You can find change log here](https://github.com/kuzn-ilya/react-promise-renderer/blob/master/docs/CHANGELOG.md)

## Credits

Great thanks to [@kitos](https://github.com/kitos) and [@ventrz](https://github.com/ventrz) for their invaluable help, support and bright ideas!
