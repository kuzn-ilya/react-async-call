import * as React from 'react'

export type RenderResult =
  | JSX.Element
  | Array<JSX.Element | string | number | null | false>
  | string
  | number
  | null
  | false

interface IAsyncCallChildrenFunctionParams<Result> {
  running: boolean
  rejected: boolean
  resolved: boolean
  result?: Result
  rejectReason?: any
  execute: () => void
}

type AsyncCallChildrenFunction<Result> = (params: IAsyncCallChildrenFunctionParams<Result>) => RenderResult

interface IAsyncCallProps<Params, Result> {
  params: Params
  lazy?: boolean
  children?: AsyncCallChildrenFunction<Result> | RenderResult
}

interface IRejectedChildrenFunctionParams {
  rejectReason: any
}

type RejectedChildrenFunction = (params: IRejectedChildrenFunctionParams) => RenderResult

interface IRejectedProps {
  children?: RejectedChildrenFunction | RenderResult
}

interface IResolvedChildrenFunctionParams<Result> {
  result: Result
}

type ResolvedChildrenFunction<Result> = (params: IResolvedChildrenFunctionParams<Result>) => RenderResult

interface IResolvedProps<Result> {
  children?: ResolvedChildrenFunction<Result> | RenderResult
}

interface IExecutorChildrenFunctionParams {
  execute: () => void
}

type ExecutorChildrenFunction = (params: IExecutorChildrenFunctionParams) => RenderResult

interface IExecutorProps {
  children: ExecutorChildrenFunction
}

interface IHasResultChildrenFunctionParams<Result> {
  result: Result
}

type HasResultChildrenFunction<Result> = (params: IHasResultChildrenFunctionParams<Result>) => RenderResult

interface IHasResultProps<Result> {
  children: HasResultChildrenFunction<Result>
}

interface IResetterChildrenFunctionParams {
  reset: (execute: boolean = true) => void
}

type ResetterChildrenFunction = (params: IResetterChildrenFunctionParams) => RenderResult

interface IResetterProps {
  children: ResetterChildrenFunction
}

interface IStateChildrenFunctionParams<Result> {
  running: boolean
  rejected: boolean
  resolved: boolean
  result?: Result
  rejectReason?: any
  execute: () => void
}

type StateChildrenFunction<Result> = (params: IStateChildrenFunctionParams<Result>) => RenderResult

interface IStateProps<Result> {
  children?: StateChildrenFunction<Result>
}

interface IResultStoreChildrenFunction<Result> {
  result?: Result
  hasResult: boolean
  reset: (execute: boolean) => void
}

type ResultStoreChildrenFunction<Result> = (params: IResultStoreChildrenFunction<Result>) => RenderResult

interface IResultStoreProps<Result> {
  reduce?: (accumulator: Result, currentResult: Result) => Result
  initialValue?: Result
  reset?: boolean
  children?: ResultStoreChildrenFunction<Result> | RenderResult
}

interface IResultStore<Result> {
  HasResult: React.ComponentType<IHasResultProps<Result>>
  Resetter: React.ComponentType<IResetterProps>
  new(): React.Component<IResultStoreProps<Result>>
}

declare class AsyncCall<Params, Result> extends React.Component<IAsyncCallProps<Params, Result>> {
  execute()
}

interface IAsyncCall<Params, Result> {
  Running: React.ComponentType<{}>
  Completed: React.ComponentType<{}>
  Resolved: React.ComponentType<IResolvedProps<Result>>
  Rejected: React.ComponentType<IRejectedProps>
  Executor: React.ComponentType<IExecutorProps>
  State: React.ComponentType<IStateProps<Result>>
  ResultStore: IResultStore<Result>
  contextPropName: string
  new(): AsyncCall<Params, Result>
}

declare function createAsyncCallComponent<Params, Result>(
  queryFunc: (params: Params) => PromiseLike<Result>,
  displayName?: string,
): IAsyncCall<Params, Result>

export default createAsyncCallComponent
