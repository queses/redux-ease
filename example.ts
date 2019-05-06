import { getActionCreator, getReducerBuilder } from "./src/getters";

const initialState = {
  counter: 0
}

const actionBuilder = getActionCreator('COUNTER')

const actions = actionBuilder.getConstants(['DECREACE', 'TO_ZERO'])

export const increace = actionBuilder.build('INCREACE', (amount: number = 1) => ({ amount }))

export const decrease = actionBuilder.buildDynamic((amount: number = 1) => ({
  type: actions.DECREACE,
  payload: { amount }
}))

export const toZero = actionBuilder.buildDynamic(() => ({
  type: actions.TO_ZERO
}))

export const reducer = getReducerBuilder(initialState)
  .copyState()
  .handle(increace, (s, a) => ({ counter: s.counter + a.payload.amount }))
  .handleType<{ amount: number }>(actions.DECREACE, (s, a) => ({ counter: s.counter - a.payload.amount }))
  .handleType(actions.TO_ZERO, () => ({ counter: 0 }))
  .build()
