import * as React from 'react'

export type RenderResult = JSX.Element | Array<JSX.Element> | string | number | null | false

interface IPromiseRendererChildrenFunctionParams<Result> {
  running: boolean
  result?: Result
  hasResult: boolean
  rejected: boolean
  rejectReason: any
  execute: () => void
}

type PromiseRendererChildrenFunction<Result> = (params: IPromiseRendererChildrenFunctionParams<Result>) => RenderResult

interface IPromiseRendererProps<Params, Result> {
  params: Params
  mergeResult?: (prevResult: Result, currentResult: Result) => Result
  children?: PromiseRendererChildrenFunction<Result> | RenderResult
}

type RejectedChildrenFunction = (reason: any) => RenderResult

interface IRejectedProps {
  children?: RejectedChildrenFunction | RenderResult
}

type ExecutorChildrenFunction = () => RenderResult
interface IExecutorProps {
  children: ExecutorChildrenFunction
}

type ResultChildrenFunction<Result> = (result: Result) => RenderResult

interface IResultProps<Result> {
  children: ResultChildrenFunction<Result>
}

interface IQueryTypes<Params, Result> {
  Running: React.ComponentType<{}>
  Resolved: React.ComponentType<{}>
  Rejected: React.ComponentType<IRejectedProps>
  Executor: React.ComponentType<IExecutorProps>
  Result: React.ComponentType<IResultProps<Result>>
  new (): React.Component<IPromiseRendererProps<Params, Result>>
}

declare function createPromiseRenderer<Params, Result>(
  queryFunc: (params: Params) => PromiseLike<Result>,
  displayName?: string,
): IQueryTypes<Params, Result>

export default createPromiseRenderer
