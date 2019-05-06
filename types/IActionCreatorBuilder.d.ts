import { TOptionalPayloadAction, TDynamicExportedActionCreator, TExportedActionCreator } from "./types";

export interface IActionCreatorBuilder {
  getConst (actionTypeCode: string): string
  
  getConstants <T extends string, U = { [K in T]: string }> (actionTypeCodes: T[]): U

  build <A, P> (actionTypeCode: string, creator: (...args: A[]) => P): TExportedActionCreator<A, P>

  buildDynamic <A, P = any> (creator: (...args: A[]) => TOptionalPayloadAction<P>): TDynamicExportedActionCreator<A, P>
}