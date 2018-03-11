import * as React from 'react'

export type RenderResult = JSX.Element | Array<JSX.Element> | string | number | null | false

type PromiseRendererChildrenFunction<QueryResult> = (loading: boolean, result?: QueryResult) => RenderResult

interface IPromiseRendererProps<QueryParams, QueryResult> {
  params: QueryParams
  children?: PromiseRendererChildrenFunction<QueryResult> | RenderResult
}

type ResolvedChildrenFunction<QueryResult> = (result: QueryResult) => RenderResult

interface IResolvedProps<QueryResult> {
  children?: ResolvedChildrenFunction<QueryResult> | RenderResult
}

type RejectedChildrenFunction = (reason: any) => RenderResult

interface IRejectedProps {
  children?: RejectedChildrenFunction | RenderResult
}

interface IQueryTypes<QueryParams, QueryResult> {
  Pending: React.ComponentType<{}>
  Resolved: React.ComponentType<IResolvedProps<QueryResult>>
  Rejected: React.ComponentType<IRejectedProps>
  new (): React.Component<IPromiseRendererProps<QueryParams, QueryResult>>
}

declare function createPromiseRenderer<QueryParams, QueryResult>(
  queryFunc: (params: QueryParams) => Promise<QueryResult>,
): IQueryTypes<QueryParams, QueryResult>

export default createPromiseRenderer
