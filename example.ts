import { getActionCreator, getReducerBuilder } from "./src/getters";
import { TDynamicExportedActionCreator } from "./types/types";

const initialState = {
  counter: 0,
  canGoBelowZero: false
}

const actionBuilder = getActionCreator('COUNTER')

const actions = actionBuilder.getConstants([
  'DECREACE',
  'TO_ZERO'
])

export const increase = actionBuilder.build('INCREASE', (amount: number = 1) => ({ amount }))

export const decrease: TDynamicExportedActionCreator<number, { amount: number }> = actionBuilder.buildDynamic((amount: number = 1) => ({
  type: actions.DECREACE,
  payload: { amount }
}))

export const toZero = actionBuilder.buildDynamic(() => ({
  type: actions.TO_ZERO
}))

export const reducer = getReducerBuilder(initialState)
  .copyState()
  .handle(increase, (s, a) => ({ counter: s.counter + a.payload.amount }))
  .handleType<{ amount: number }>( // Unnecessary to specify type 
    actions.DECREACE, (s, a) => ({
      counter: (s.canGoBelowZero || a.payload.amount < s.counter) ? s.counter - a.payload.amount : 0
    })
  )
  .handleType(actions.TO_ZERO, () => ({ counter: 0 }))
  .build()
