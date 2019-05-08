import { TExportedActionCreator, TOptionalPayloadAction, TDynamicExportedActionCreator, TActionPayloadCreator } from "../types/types";
import { IActionCreatorBuilder } from "../types/IActionCreatorBuilder";

export class ActionCreatorBuilder implements IActionCreatorBuilder {
  private actionTypePrefix: string
  
  constructor (reducerCode: string = '', reducerJoinSymbol: string = '_') {
    this.actionTypePrefix = (reducerCode) ? reducerCode + reducerJoinSymbol : ''
  }
  
  getConst (actionTypeCode: string) {
    return this.actionTypePrefix + actionTypeCode
  }
  
  getConstants <T extends string, U = { [K in T]: string }> (actionTypeCodes: T[]): U {
    const result: any = {}
    actionTypeCodes.forEach((actionTypeCode) => {
      result[actionTypeCode] = this.actionTypePrefix + actionTypeCode
    })
  
    return result
  }
  
  build <A, P> (actionTypeCode: string, creator?: TActionPayloadCreator<A, P>): TExportedActionCreator<A, P> {
    const typeCode = this.getConst(actionTypeCode)
    return this.getExportedActionCreator(typeCode, creator)
  }

  extend <A, P> (action: TExportedActionCreator<any, P>, creator: TActionPayloadCreator<A, P>): TExportedActionCreator<A, P> {
    const typeCode = action.typeCode
    return this.getExportedActionCreator(typeCode, creator)
  }
  
  buildDynamic <A, P = any> (creator: TDynamicExportedActionCreator<A, P>): TDynamicExportedActionCreator<A, P> {
    return creator
  }

  private getExportedActionCreator <A, P> (
    typeCode: string, creator?: TActionPayloadCreator<A, P>
  ): TExportedActionCreator<A, P> {
    const actionCreator = function (...args: A[]) {
      return {
        type: typeCode,
        payload: creator && Reflect.apply(creator, undefined, args)
      }
    }
  
    actionCreator.typeCode = typeCode
  
    return actionCreator
  }
}