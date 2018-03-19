# react-promise-renderer

[![npm version](https://badge.fury.io/js/react-promise-renderer.svg)](https://badge.fury.io/js/react-promise-renderer)
[![Build Status](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg?branch=master)](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg)
[![codecov](https://codecov.io/gh/kuzn-ilya/react-promise-renderer/branch/master/graph/badge.svg)](https://codecov.io/gh/kuzn-ilya/react-promise-renderer)

## Overview

Declarative promise handling in React.

## Install

### Using npm

`npm i react-promise-renderer --save`

Then, use it as usual:

```JS
// using ES6 modules
import createAsyncCallComponent from 'react-promise-renderer'

// using CommonJS modules
var createAsyncCallComponent = require('react-promise-renderer').createAsyncCallComponent
```

### UMD build

The UMD build is also available on [unpkg](https:/unpkg.com):

```HTML
<script src="https://unpkg.com/react-promise-renderer"></script>
```

The package is avalable on `window.ReactPromiseRenderer`

## Usage

### Declarative

[![Declarative](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n3jm0opz3p)

```jsx
import createAsyncCallComponent from 'react-promise-renderer'

const PromiseRenderer = createAsyncCallComponent(value => Promise.resolve(42))

const Example = () => (
  <PromiseRenderer>
    <PromiseRenderer.Running>
      <div>Loading...</div>
    </PromiseRenderer.Running>
    <PromiseRenderer.Result>{result => <div>The result of function call is {result}</div>}</PromiseRenderer.Result>
    <PromiseRenderer.Rejected>{reason => <div>Error: {reason}</div>}</PromiseRenderer.Rejected>
  </PromiseRenderer>
)
```

### Render Props

[![Render Props](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n28n77vqj)

```jsx
import createAsyncCallComponent from 'react-promise-renderer'

const PromiseRenderer = createAsyncCallComponent(value => Promise.resolve(42))

const Example = () => (
  <PromiseRenderer>
    {({ running, result, rejected, hasResult, rejectReason }) => (
      <div>
        {running && <div>Loading...</div>}
        {hasResult && <div>The result of function call is {result}</div>}
        {rejected && <div>Error: {rejectReason}</div>}
      </div>
    )}
  </PromiseRenderer>
)
```

### Data Fetching

[![Data Fetching](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/py0qypxkr0)

### Incremental Data Fetching

[![Incremental Data Fetching](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mzzvlmj65y)

## API

[See API reference here](https://github.com/kuzn-ilya/react-promise-renderer/blob/master/docs/API.md)

## Change Log

[You can find change log here](https://github.com/kuzn-ilya/react-promise-renderer/blob/master/docs/CHANGELOG.md)

## Credits

Great thanks to [@kitos](https://github.com/kitos) and [@ventrz](https://github.com/ventrz) for their invaluable help, support and bright ideas!
