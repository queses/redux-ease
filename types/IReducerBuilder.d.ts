import { TActionHandler, TExportedActionCreator, TDynamicExportedActionCreator, TAction, TReducer } from "./types";

export interface IReducerBuilder <S> {
  setDefaultState (state: S): this
  
  copyState (): this

  handle <P> (
    actionCreators: TExportedActionCreator<any, P> | string | Array<TExportedActionCreator<any, P>> | Array<string>,
    handler: TActionHandler<S, P>
  ): this

  handleType <C extends TDynamicExportedActionCreator <A, P>, A = any, P = any> (
    actionCreators: string | string[], 
    handler: TActionHandler<S, P>
  ): this
  
  build (): TReducer<S, TAction>
}