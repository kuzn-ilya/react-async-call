import * as React from 'react'

export type RenderResult = JSX.Element | Array<JSX.Element> | string | number | null | false

interface IAsyncCallChildrenFunctionParams<Result> {
  hasResult: boolean
  running: boolean
  rejected: boolean
  resolved: boolean
  result?: Result
  hasResult: boolean
  rejectReason: any
  execute: () => void
}

type AsyncCallChildrenFunction<Result> = (params: IAsyncCallChildrenFunctionParams<Result>) => RenderResult

interface IAsyncCallProps<Params, Result> {
  params: Params
  mergeResult?: (prevResult: Result, currentResult: Result) => Result
  children?: AsyncCallChildrenFunction<Result> | RenderResult
}

type RejectedChildrenFunction = (reason: any) => RenderResult

interface IRejectedProps {
  children?: RejectedChildrenFunction | RenderResult
}

type ExecutorChildrenFunction = () => RenderResult
interface IExecutorProps {
  children: ExecutorChildrenFunction
}

type HasResultChildrenFunction<Result> = (result: Result) => RenderResult

interface IHasResultProps<Result> {
  children: HasResultChildrenFunction<Result>
}

interface IStateChildrenFunctionParams<Result> {
  hasResult: boolean
  running: boolean
  rejected: boolean
  resolved: boolean
  result?: Result
  hasResult: boolean
  rejectReason: any
  execute: () => void
}

type StateChildrenFunction<Result> = (params: IStateChildrenFunctionParams<Result>) => RenderResult

interface IStateProps<Result> {
  children?: StateChildrenFunction<Result>
}

interface IQueryTypes<Params, Result> {
  Running: React.ComponentType<{}>
  Resolved: React.ComponentType<{}>
  Rejected: React.ComponentType<IRejectedProps>
  Executor: React.ComponentType<IExecutorProps>
  HasResult: React.ComponentType<IHasResultProps<Result>>
  State: React.ComponentType<IStateProps<Result>>
  new (): React.Component<IAsyncCallProps<Params, Result>>
}

declare function createAsyncCallComponent<Params, Result>(
  queryFunc: (params: Params) => PromiseLike<Result>,
  displayName?: string,
): IQueryTypes<Params, Result>

export default createAsyncCallComponent
