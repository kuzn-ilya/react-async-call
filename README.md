# react-promise-renderer

[![npm version](https://badge.fury.io/js/react-promise-renderer.svg)](https://badge.fury.io/js/react-promise-renderer)
[![Build Status](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg?branch=master)](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg)
[![codecov](https://codecov.io/gh/kuzn-ilya/react-promise-renderer/branch/master/graph/badge.svg)](https://codecov.io/gh/kuzn-ilya/react-promise-renderer)

## Overview

Declarative promise handling in React

## Install

### Using npm

`npm i react-promise-renderer --save`

Then, use it as usual:

```JS
// using ES6 modules
import createPromiseRenderer from 'react-promise-renderer'

// using CommonJS modules
var createPromiseRenderer = require('react-promise-renderer').createPromiseRenderer
```

### UMD build

The UMD build is also available on [unpkg](https:/unpkg.com):

```HTML
<script src="https://unpkg.com/react-promise-renderer"></script>
```

The package is avalable on `window.ReactPromiseRenderer`

## Usage

### Basic Usage - Classic Way

[![Basic Usage - Classic Way](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n28n77vqj)

```jsx
import createPromiseRenderer from 'react-promise-renderer'

const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(42))

const FirstExample = () => (
  <PromiseRenderer>
    {({ running, result, rejected, rejectReason }) => (
      <div>
        {running && <div>Loading...</div>}
        {!running && !rejected && <div>The result of function call is {result}</div>}
        {rejected && <div>Error: {rejectReason}</div>}
      </div>
    )}
  </PromiseRenderer>
)
```

### Basic Usage - Declarative Way

[![Basic Usage - Declarative Way](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n3jm0opz3p)

```jsx
import createPromiseRenderer from 'react-promise-renderer'

const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(42))

const SecondExample = () => (
  <PromiseRenderer>
    <PromiseRenderer.Running>
      <div>Loading...</div>
    </PromiseRenderer.Running>
    <PromiseRenderer.Resolved>{result => <div>The result of function call is {result}</div>}</PromiseRenderer.Resolved>
    <PromiseRenderer.Rejected>{reason => <div>Error: {reason}</div>}</PromiseRenderer.Rejected>
  </PromiseRenderer>
)
```

### Data Fetching

[![Data Fetching](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/py0qypxkr0)

### Incremental Data Fetching

[![Incremental Data Fetching](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mzzvlmj65y)

## Links

* [Change Log](https://github.com/kuzn-ilya/react-promise-renderer/blob/master/CHANGELOG.md)

## Credits

* Great thanks to [@kitos](https://github.com/kitos) and [@ventrz](https://github.com/ventrz) for their invaluable help, support and bright ideas!
