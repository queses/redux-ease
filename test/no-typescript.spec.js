import { getActionCreator, getReducerBuilder } from '../src' 

describe('no typescript', () => {
  it('should create actions and reducer', () => {
    const actionBuilder = getActionCreator('TEST', '/')
    const initialState = {
      value: 1,
      canGoBelowZero: false
    }
    
    const multiply = actionBuilder.build('MULTIPLY', (multiplier = 2) => ({ multiplier }))
    
    expect(multiply(4).payload.multiplier).toEqual(4)
    expect(multiply().type).toEqual('TEST/MULTIPLY')

    const reducer = getReducerBuilder(initialState).copyState()
      .handle(multiply, (s, a) => ({ value: s.value * a.payload.multiplier }))
      .build()

    expect(reducer(undefined, multiply(5)).value).toEqual(5)
  })
})