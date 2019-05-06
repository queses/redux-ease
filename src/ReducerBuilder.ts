import { TActionHandler, TExportedActionCreator, TAction } from "../types/types";
import { IReducerBuilder } from "../types/IReducerBuilder";

export class ReducerBuilder <S> implements IReducerBuilder<S> {
  private handlers: Map<string, TActionHandler<S, any>> = new Map()
  private toCopyState: boolean = false
  
  constructor (
    private defaultState: S
  ) {}
  
  setDefaultState (state: S) {
    this.defaultState = state
    return this
  }
  
  copyState () {
    this.toCopyState = true
    return this
  }
  
  handle <P> (
    actionCreators: TExportedActionCreator<any, P> | Array<TExportedActionCreator<any, P>>,
    handler: TActionHandler<S, P>
  ) {
    if (typeof handler !== 'function') {
      throw TypeError('Reducer Action Handler should be a function!')
    }
  
    if (Array.isArray(actionCreators)) {
      actionCreators.forEach((actionCreator) => { this.handlers.set(actionCreator.typeCode, handler) })
    } else {
      this.handlers.set(actionCreators.typeCode, handler)
    }
    
    return this
  }
  
  handleType <P = any> (
    actionTypes: string | string[], 
    handler: TActionHandler<S, P>
  ) {
    if (typeof handler !== 'function') {
      throw TypeError('Reducer Action Handler should be a function!')
    }
  
    if (Array.isArray(actionTypes)) {
      actionTypes.forEach((actionType) => { this.handlers.set(actionType, handler) })
    } else {
      this.handlers.set(actionTypes, handler)
    }
    
    return this
  }
  
  build () {
    return (state?: S, action?: TAction): S => {
      state = state || this.defaultState as S
    
      if (!action) {
        return state
      }
    
      if (this.handlers.has(action.type)) {
        if (this.toCopyState) {
          return Object.assign({}, state, Reflect.apply(this.handlers.get(action.type) as any, undefined, [state, action])) as S
        } else {
          return Reflect.apply(this.handlers.get(action.type) as any, undefined, [state, action]) as S
        }
      } else {
        return state
      }
    }
  }
}
  