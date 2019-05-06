import { TExportedActionCreator, TOptionalPayloadAction, TDynamicExportedActionCreator } from "../types/types";
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
  
  build <A, P> (actionTypeCode: string, creator?: (...args: A[]) => P): TExportedActionCreator<A, P> {
    const typeCode = this.getConst(actionTypeCode)
  
    function actionCreator (...args: A[]) {
      return {
        type: typeCode,
        payload: creator && Reflect.apply(creator, undefined, args)
      }
    }
  
    actionCreator.typeCode = typeCode
  
    return actionCreator
  }
  
  buildDynamic <A, P = any> (creator: (...args: A[]) => TOptionalPayloadAction<P>): TDynamicExportedActionCreator<A, P> {
    return creator
  }
}