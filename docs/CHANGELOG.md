# Change Log

## 0.1.20

* Eslint has been added
* Extra unit tests have been added
* `AsyncCall.contextPropName` static property has been added
* Documentation changes

## 0.1.19

* The package has been renamed to react-async-call
* `Result` inner component has been renamed to `HasResult`

## 0.1.18

* New subcomponent `State` has been added
* Inner components have been reimplemented as functional components
* Project structure has been reworked : split index files into separate modules
* Renamed PromiseRenderer -> AsyncCall, createPromiseRenderer -> createAsyncCallComponent

## 0.1.16

* Fix: do not render Resolved sub-component's children while promise is on running phase ([issue #14](https://github.com/kuzn-ilya/react-async-call/issues/14))

## 0.1.15

* Fix UMD build. Now it's available on https://unpkg.com/react-async-call.
* Update [README.md](https://github.com/kuzn-ilya/react-async-call/blob/master/README.md)
* Move [CHANGELOG.md](https://github.com/kuzn-ilya/react-async-call/blob/master/docs/CHANGELOG.md) into docs folder
* Add [API.md](https://github.com/kuzn-ilya/react-async-call/blob/master/docs/API.md) into docs folder

## 0.1.14

* Get rid of <Resolved> children as function
* Add <Result> sub-component
* Update typings: add displayName arg to createPromiseRenderer function.

## 0.1.13

* Added `hasResult` property into children function argument of the root component.
* Added `displayName` properties to components.
* Throw error if sub-component is not a child (direct or indirect) of root components.

## 0.1.12

* Added ability to re-execute promise-returning function manualy (see an [issue #3](https://github.com/kuzn-ilya/react-async-call/issues/3) for details):
  * Pass new property `execute: () => void` to children function of root component
  * New component `<Executor />` has been added. It has to have one mandatory property `children` that should be a function with one argument (`execute`) of type `() => void`.
* Added additional minor check for result of promise-returning function. Result should be a PromiseLike object.

## 0.1.8 - 0.1.11

* Result of promise resolving is cleared between promise-returning function calls.
* New optional property `mergeResult: (prevResult: QueryResult, currentResult: QueryResult) => QueryResult` added into root component.
