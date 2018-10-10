# Change Log

# [0.4.0](https://github.com/kuzn-ilya/react-async-call/compare/v0.3.1...v0.4.0) (2018-10-10)


### Features

* split build into production and development ([d3e20b2](https://github.com/kuzn-ilya/react-async-call/commit/d3e20b2)), closes [#26](https://github.com/kuzn-ilya/react-async-call/issues/26)

# [0.3.1](https://github.com/kuzn-ilya/react-async-call/compare/v0.2.7...v0.3.1) (2018-10-09)


### Bug Fixes

* **AsyncCall.ResultStore:** drill down root context of AsyncCall component properly ([8cd56b8](https://github.com/kuzn-ilya/react-async-call/commit/8cd56b8)), closes [#24](https://github.com/kuzn-ilya/react-async-call/issues/24)
* **AsyncCall.ResultStore.Resetter:** add default value for reset method (execute = true) [skip release] ([f6f9096](https://github.com/kuzn-ilya/react-async-call/commit/f6f9096))


### Features

* **AsyncCall.ResultStore.Resetter:** new static component AsyncCall.ResultStore.Resetter for store cleaning ([78126a9](https://github.com/kuzn-ilya/react-async-call/commit/78126a9))
* **AsyncCall.ResultStore.Resetter:** add Resetter to index.d.ts [skip release] ([cd8cae3](https://github.com/kuzn-ilya/react-async-call/commit/cd8cae3))

## [0.2.7](https://github.com/kuzn-ilya/react-async-call/compare/v0.2.6...v0.2.7) (2018-10-06)


### Bug Fixes

* move codecov from dependencies into devDependencies ([b594fc3](https://github.com/kuzn-ilya/react-async-call/commit/b594fc3))

## [0.2.6](https://github.com/kuzn-ilya/react-async-call/compare/v0.2.5...v0.2.6) (2018-10-04)


### Bug Fixes

* **rollup:** remove fbjs from external dependencies ([09d607f](https://github.com/kuzn-ilya/react-async-call/commit/09d607f))

## [0.2.5](https://github.com/kuzn-ilya/react-async-call/compare/v0.2.4...v0.2.5) (2018-10-04)


### Bug Fixes

* add fbjs@0.8.0 as dependency instead of peer dependency ([83538f2](https://github.com/kuzn-ilya/react-async-call/commit/83538f2)), closes [#19](https://github.com/kuzn-ilya/react-async-call/issues/19)

## 0.2.3

* Bug fixing: unmount component during async call correctly
* Chore: Tests have been splitted by testing area

## 0.2.2

* `lazy` prop has been added to `AsynCall` component

## 0.2.1

* Fix typings

## 0.2.0

* `ResultStore` sub-component has been added instead of `mergeResult` prop
* `Completed` component has been added. It renders its children when the promise either rejected or resolved.
* `HasResult` must be a child of a new `ResultStore` component
* `Rejected`, `Resolved` and `Executor` pass objects into theirs children functions.

## 0.1.20

* Eslint has been added
* Extra unit tests have been added
* `AsyncCall.contextPropName` static property has been added
* Documentation changes
* TypeScript examples have been added

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
