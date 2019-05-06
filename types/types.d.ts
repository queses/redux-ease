export interface TActionCreator <A = any, P = any> {
  (actionTypeCode: string, creator: (...args: A[]) => P): TExportedActionCreator<A, P>
  appendToTypeCode?: string
}

export interface TGetActionCreator <A = any[], P = any> {
  (reducerCode?: string, joinSymbol?: string): TActionCreator<A, P>
}

export interface TExportedActionCreator <A, P> {
  (...args: A[]): TAction<P>
  typeCode: string
}

export interface TDynamicExportedActionCreator <A, P> {
  (...args: A[]): TOptionalPayloadAction<P>
}

export interface TOptionalPayloadAction <P = any> {
  type: string,
  payload?: P
}

export interface TAction <P = any> {
  type: string,
  payload: P
}

export interface TActionHandler <S, P> {
  (s: S, a: TAction<P>): S | {}
}

export interface TReducer<S = any, A extends TAction<any> = any> {
  (state: S | undefined, action: A): S
}
