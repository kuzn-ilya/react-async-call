import * as React from 'react'

import createReactAsyncCall from '../index'

// See https://github.com/Microsoft/TypeScript/issues/18523#issuecomment-329979963 for details
type HasType<T, Q extends T> = Q

function testCreateReactAsyncCall() {
  createReactAsyncCall(() => Promise.resolve())

  createReactAsyncCall(params => Promise.resolve('100500'))

  // typings:expect-error
  createReactAsyncCall()

  // typings:expect-error
  createReactAsyncCall(() => void 0)

  // typings:expect-error
  createReactAsyncCall(() => 100500)

  // typings:expect-error
  createReactAsyncCall(() => Promise.resolve(), 100500)
}

function testAsyncCall() {
  const AsyncCall = createReactAsyncCall((x: number) => Promise.resolve('100500'))

  // typings:expect-error
  const test01 = <AsyncCall />

  // typings:expect-error
  const test02 = <AsyncCall params="100500" />

  const test03 = <AsyncCall params={100500} />

  const test04 = <AsyncCall params={100500}>Hello</AsyncCall>

  const test05 = <AsyncCall params={100500}>{props => <div>Hello</div>}</AsyncCall>

  // typings:expect-error
  const test06 = <AsyncCall params={100500}>{({ unsupportedProp }) => <div>Hello</div>}</AsyncCall>

  const test07 = (
    <AsyncCall params={100500}>
      {({ running, rejected, resolved, result, rejectReason, execute }) => {
        type StaticAssert1 = HasType<boolean, typeof running>
        type StaticAssert2 = HasType<boolean, typeof rejected>
        type StaticAssert3 = HasType<boolean, typeof resolved>
        type StaticAssert4 = HasType<string | undefined, typeof result>
        type StaticAssert5 = HasType<boolean, typeof rejectReason>
        type StaticAssert6 = HasType<() => void, typeof execute>

        return <div>Hello</div>
      }}
    </AsyncCall>
  )

  // typings:expect-error
  const test08 = <AsyncCall.UnsupportedStatic />

  // typings:expect-error
  const test09 = <AsyncCall params={100500} lazy="123" />

  const test10 = <AsyncCall params={100500} lazy={true} />
}

function testCompleted() {
  const Completed = createReactAsyncCall((x: number) => Promise.resolve('100500')).Completed

  const test1 = <Completed />

  const test2 = <Completed>Hello</Completed>
}

function testExecutor() {
  const Executor = createReactAsyncCall((x: number) => Promise.resolve('100500')).Executor

  // typings:expect-error
  const test1 = <Executor />

  // typings:expect-error
  const test2 = <Executor>Hello</Executor>

  // typings:expect-error
  const test3 = <Executor>{({ unsupportedProps }) => <div />}</Executor>

  const execute = (
    <Executor>
      {({ execute }) => {
        type StaticAssert = HasType<() => void, typeof execute>

        return <div />
      }}
    </Executor>
  )
}

function testRejected() {
  const Rejected = createReactAsyncCall((x: number) => Promise.resolve('100500')).Rejected

  const test1 = <Rejected />

  const test2 = <Rejected>Hello</Rejected>

  // typings:expect-error
  const test3 = <Rejected>{({ unsupportedProp }) => <div />}</Rejected>

  const test4 = (
    <Rejected>
      {({ rejectReason }) => {
        type StaticAssert = HasType<any, typeof rejectReason>

        return <div />
      }}
    </Rejected>
  )
}

function testResolved() {
  type Result = { x: string }
  const Resolved = createReactAsyncCall((x: number) => Promise.resolve({ x: '100500' })).Resolved

  const test1 = <Resolved />

  const test2 = <Resolved>Hello</Resolved>

  // typings:expect-error
  const test3 = <Resolved>{({ unsupportedProp }) => <div />}</Resolved>

  const test4 = (
    <Resolved>
      {({ result }) => {
        type StaticAssert = HasType<Result, typeof result>

        return <div />
      }}
    </Resolved>
  )
}

function testRunning() {
  const Running = createReactAsyncCall((x: number) => Promise.resolve('100500')).Running

  const test1 = <Running />

  const test2 = <Running>Hello</Running>
}

function testState() {
  const State = createReactAsyncCall((x: number) => Promise.resolve('100500')).State

  const test1 = <State />

  // typings:expect-error
  const test2 = <State>Hello</State>

  // typings:expect-error
  const test3 = <State>{({ unsupportedProp }) => <div />}</State>

  const test4 = (
    <State>
      {({ running, rejected, resolved, result, rejectReason, execute }) => {
        type StaticAssert1 = HasType<boolean, typeof running>
        type StaticAssert2 = HasType<boolean, typeof rejected>
        type StaticAssert3 = HasType<boolean, typeof resolved>
        type StaticAssert4 = HasType<string | undefined, typeof result>
        type StaticAssert5 = HasType<boolean, typeof rejectReason>
        type StaticAssert6 = HasType<() => void, typeof execute>

        return <div>Hello</div>
      }}
    </State>
  )
}

function testResultStore() {
  const ResultStore = createReactAsyncCall((x: number) => Promise.resolve('100500')).ResultStore

  const test01 = <ResultStore />

  const test02 = <ResultStore>Hello</ResultStore>

  // typings:expect-error
  const test03 = <ResultStore reset="true">Hello</ResultStore>

  const test04 = <ResultStore reset={false}>Hello</ResultStore>

  // typings:expect-error
  const test05 = <ResultStore initialValue={1}>Hello</ResultStore>

  const test06 = <ResultStore initialValue="123">Hello</ResultStore>

  // typings:expect-error
  const test07 = <ResultStore reduce="123">Hello</ResultStore>

  const test08 = <ResultStore reduce={(accum, current) => accum + current}>Hello</ResultStore>

  // typings:expect-error
  const test09 = <ResultStore>{({ unsupportedProp }) => <div />}</ResultStore>

  const test10 = (
    <ResultStore>
      {({ hasResult, result, reset }) => {
        type StaticAssert1 = HasType<boolean, typeof hasResult>
        type StaticAssert2 = HasType<string | undefined, typeof result>
        type StaticAssert3 = HasType<(arg: boolean) => void, typeof reset>

        return <div>Hello</div>
      }}
    </ResultStore>
  )
}

function testHasResult() {
  type Result = { x: string }
  const HasResult = createReactAsyncCall((x: number) => Promise.resolve({ x: '100500' })).ResultStore.HasResult

  // typings:expect-error
  const test1 = <HasResult />

  // typings:expect-error
  const test2 = <HasResult>Hello</HasResult>

  // typings:expect-error
  const test3 = <HasResult>{({ unsupportedProp }) => <div />}</HasResult>

  const test4 = (
    <HasResult>
      {({ result }) => {
        type StaticAssert = HasType<Result, typeof result>

        return <div />
      }}
    </HasResult>
  )
}

function testResetter() {
  const Resetter = createReactAsyncCall((x: number) => Promise.resolve('100500')).ResultStore.Resetter

  // typings:expect-error
  const test1 = <Resetter />

  // typings:expect-error
  const test2 = <Resetter>Hello</Resetter>

  // typings:expect-error
  const test3 = <Resetter>{({ unsupportedProp }) => <div />}</Resetter>

  const test4 = (
    <Resetter>
      {({ reset }) => {
        type StaticAssert = HasType<(arg?: boolean) => void, typeof reset>

        return <div />
      }}
    </Resetter>
  )
}
