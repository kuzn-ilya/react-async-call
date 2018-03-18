# Change Log

## 0.1.15

* Fix UMD build. Now it's available on https://unpkg.com/react-promise-renderer.
* Update README.md
* Move CHANGELOG.md into docs folder
* Add API.md into docs folder

## 0.1.14

* Get rid of <Resolved> children as function
* Add <Result> sub-component
* Update typings: add displayName arg to createPromiseRenderer function.

## 0.1.13

* Added `hasResult` property into children function argument of the root component.
* Added `displayName` properties to components.
* Throw error if sub-component is not a child (direct or indirect) of root components.

## 0.1.12

* Added ability to re-execute promise-returning function manualy (see an [issue #3](https://github.com/kuzn-ilya/react-promise-renderer/issues/3) for details):
  * Pass new property `execute: () => void` to children function of root component
  * New component `<Executor />` has been added. It has to have one mandatory property `children` that should be a function with one argument (`execute`) of type `() => void`.
* Added additional minor check for result of promise-returning function. Result should be a PromiseLike object.

## 0.1.8 - 0.1.11

* Result of promise resolving is cleared between promise-returning function calls.
* New optional property `mergeResult: (prevResult: QueryResult, currentResult: QueryResult) => QueryResult` added into root component.
