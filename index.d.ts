import * as React from 'react'

export type RenderResult = JSX.Element | Array<JSX.Element> | string | number | null | false

type PromiseRendererChildrenFunction<QueryResult> = (loading: boolean, result?: QueryResult) => RenderResult

interface IPromiseRendererProps<QueryParams, QueryResult> {
  params: QueryParams
  children?: PromiseRendererChildrenFunction<QueryResult> | RenderResult
}

type RendererChildrenFunction<QueryResult> = (result: QueryResult) => RenderResult

interface IRendererProps<QueryResult> {
  children?: RendererChildrenFunction<QueryResult> | RenderResult
}

interface IQueryTypes<QueryParams, QueryResult> {
  Pending: React.ComponentType<{}>
  Renderer: React.ComponentType<IRendererProps<QueryResult>>
  new (): React.ComponentType<IPromiseRendererProps<QueryParams, QueryResult>>
}

declare function createPromiseRenderer<QueryParams, QueryResult>(
  queryFunc: (params: QueryParams) => Promise<QueryResult>,
): IQueryTypes<QueryParams, QueryResult>

declare module 'react-promise-renderer' {
  export = createPromiseRenderer
}
