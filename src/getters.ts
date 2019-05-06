import { ActionCreatorBuilder } from "./ActionCreatorBuilder";
import { ReducerBuilder } from "./ReducerBuilder";

export const getActionCreator = (reducerCode?: string, joinSymbol = '_') => {
  return new ActionCreatorBuilder(reducerCode, joinSymbol)
}

export const getReducerBuilder = <S> (defaultState: S) => {
  return new ReducerBuilder(defaultState)
}
