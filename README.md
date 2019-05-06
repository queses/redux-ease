# Redux Ease 👌

Reduce Redux boilerplate with ease 🤗

## Usage example

Let's make a simple counter reducer. It should handle two action types: `COUNTER_INCREASE` to increase counter value and `COUNTER_TO_ZERO` to reset counter value.

Initial state looks as simple as:

```js
const initialState = { value: 0 }
```

At first, lets create the [action creator builder](#ActionCreatorBuilder) and set action types namespace to `COUNTER`:

```js
// counter-actions.ts

import { getActionCreator } from "redux-ease";

const actionBuilder = getActionCreator('COUNTER')
```

Then, we have to two options to build and handle action creators:

### Main option: No action constants

Let's build our action creators:

```js
// counter-actions.ts

export const counterIncreace = actionBuilder.build('INCREACE', (amount: number = 1) => ({ amount }))

export const counterToZero = actionBuilder.build('TO_ZERO')
```

Then, let's create reducer with [reducer builder](#ReducerBuilder):

```js
// counter-reducer.ts

import { getReducerBuilder } from "redux-ease";

export const counterReducer = getReducerBuilder(initialState)
  .copyState()
  // TypeScript knows: action's payload has `amount` property with `number` type:
  .handle(counterIncreace, (s, a) => ({ value: s.value + a.payload.amount }))
  .hanlde(counterToZero, () => ({ value: 0 })
  .build()
```

Thats it! 8 lines and we're done. Also, if you're using TypeScript as I do, you can see nice type hints for action payload content.

## Alternative option: With action constants

If you want to define actions constants, Redux Ease also can help you to simplify this task:

```js
// counter-actions.ts

// TypeScript knows: `counterActions` has `INCREASE` and `TO_ZERO` properties.
export const counterActions = actionBuilder.getConstants(['INCREACE', 'TO_ZERO'])

/*
  `counterActions` equals {
    INCREASE: 'COUNTER_INCREASE',
    TO_ZERO: 'COUNTER_TO_ZERO'
  }
*/
```

Alternatively, if you prefer to manualy create actions, you can do this:

```js
// counter-actions.ts

export const INCREACE = actionBuilder.getConst('INCREACE') // equals 'COUNTER_INCREACE'
```

Then, let's create reducer:

```js
// counter-reducer.ts

export const counterReducer = getReducerBuilder(initialState)
  .copyState()
  .handle(counterActions.INCREACE, (s, a) => ({ value: s.value + a.payload.amount }))
  .hanlde(counterActions.TO_ZERO, () => ({ value: 0 })
  .build()
```

Unfortunately, TypeScript doesn't know action's payload type, but we can specify it manyally:

```js
// counter-reducer.ts

// ...
  .handle<{ amount: number }>(counterActions.INCREACE, (s, a) => ({ value: s.value + a.payload.amount }))
// ...
```

## Usage with immutable library

For example we're gonna use the awesome `seamless-immutable` library.

`counter-actions.ts` doesn't changes, so let's look at `counter-reducer.ts`:

```js
// counter-reducer.ts

import Immutable from 'seamless-immutable'

const initialState = Immutable({ counter: 0 })

export const counterReducer = getReducerBuilder(initialState)
  .copyState()
  .handle(counterIncreace, (s, a) => s.set('value', s.value + a.payload.amount))
  .hanlde(counterToZero, () => s.set('value', 0)
  .build()
```

That's it!

## API

#### ActionCreatorBuilder
See interface declaration in [`./types/IActionCreatorBuilder.d.ts`](https://github.com/queses/redux-ease/blob/master/types/IActionCreatorBuilder.d.ts) 👀

#### ReducerBuilder
See interface declaration in [`./types/IReducerBuilder.d.ts`](https://github.com/queses/redux-ease/blob/master/types/IReducerBuilder.d.ts) 👀

