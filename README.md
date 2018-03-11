# react-promise-renderer

[![npm version](https://badge.fury.io/js/react-promise-renderer.svg)](https://badge.fury.io/js/react-promise-renderer)
[![Build Status](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg?branch=master)](https://travis-ci.org/kuzn-ilya/react-promise-renderer.svg)
[![codecov](https://codecov.io/gh/kuzn-ilya/react-promise-renderer/branch/master/graph/badge.svg)](https://codecov.io/gh/kuzn-ilya/react-promise-renderer)

## Overview

Declarative promise handling in React

## Install

`npm i react-promise-renderer --save`

## Usage

```jsx
import createPromiseRenderer from 'react-promise-renderer'

const PromiseRenderer = createPromiseRenderer(value => Promise.resolve(42))

// Execute function on mount
const firstExample = () => (
  <PromiseRenderer>
    {(pending, result, rejected, rejectReason)=>(
      pending && <div>Loading...</div>
      !pending && !rejected && <div>The result of function call is {result}</div>
      rejected && <div>Error: {rejectReason}</div>
    )}
  </PromiseRenderer>
)

// The same as the first, but more declarative
const secondExample = () => (
  <PromiseRenderer>
    <PromiseRenderer.Pending>
      <div>Loading...</div>
    </PromiseRenderer.Pending>
    <PromiseRenderer.Resolved>
      {(result) =>
        <div>The result of function call is {result}</div>
      }
    </PromiseRenderer.Resolved>
    <PromiseRenderer.Rejected>
      {(reason) =>
        <div>Error: {reason}</div>
      }
    </PromiseRenderer.Rejected>
  </PromiseRenderer>
)
```
