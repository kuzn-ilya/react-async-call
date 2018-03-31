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
  rejectReason: any
  execute: () => void
}

type AsyncCallChildrenFunction<Result> = (params: IAsyncCallChildrenFunctionParams<Result>) => RenderResult

interface IAsyncCallProps<Params, Result> {
  params: Params
  children?: AsyncCallChildrenFunction<Result> | RenderResult
}

type RejectedChildrenFunction = (reason: any) => RenderResult

interface IRejectedProps {
  children?: RejectedChildrenFunction | RenderResult
}

type ResolvedChildrenFunction<Result> = (result: Result) => RenderResult

interface IResolvedProps<Result> {
  children?: ResolvedChildrenFunction<Result> | RenderResult
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

type ResultStoreChildrenFunction<Result> = (result: Result) => RenderResult

interface IResultStoreProps<Result> {
  reduce?: (accumulator: Result, currentResult: Result) => Result
  initialValue?: Result
  reset?: boolean
  children?: ResultStoreChildrenFunction<Result> | RenderResult
}

class AsyncCall<Params, Result> extends React.Component<IAsyncCallProps<Params, Result>> {
  execute()
}

interface IResultStore<Result> {
  HasResult: React.ComponentType<IHasResultProps<Result>>
  new (): React.Component<IResultStoreProps<Result>>
}

interface IQueryTypes<Params, Result> {
  Running: React.ComponentType<{}>
  Completed: React.ComponentType<{}>
  Resolved: React.ComponentType<IResolvedProps<Result>>
  Rejected: React.ComponentType<IRejectedProps>
  Executor: React.ComponentType<IExecutorProps>
  State: React.ComponentType<IStateProps<Result>>
  ResultStore: IResultStore<Result>
  contextPropName: string
  new (): AsyncCall<Params, Result>
}

declare function createAsyncCallComponent<Params, Result>(
  queryFunc: (params: Params) => PromiseLike<Result>,
  displayName?: string,
): IQueryTypes<Params, Result>

export default createAsyncCallComponent
