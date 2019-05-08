# Redux Ease 👌

Reduce Redux boilerplate with ease 🤗

Works great with both JavaScript and TypeScript.

## Installation

```
yarn add redux-ease
```

or...

```
npm i redux-ease
```

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

export const counterIncrease = actionBuilder.build('INCREASE', (amount = 1) => ({ amount }))

export const counterToZero = actionBuilder.build('TO_ZERO')
```

Then, let's create reducer with [reducer builder](#ReducerBuilder):

```js
// counter-reducer.ts

import { getReducerBuilder } from "redux-ease";

export const counterReducer = getReducerBuilder(initialState)
  .copyState()
  // Type hinting knows that action's payload has `amount` property:
  .handle(counterIncrease, (s, a) => ({ value: s.value + a.payload.amount }))
  .hanlde(counterToZero, () => ({ value: 0 })
  .build()
```

Thats it! 8 lines and we're done. If you're using IDE which supports TypeScript-based type hinting (WebStorm or VS Code, for example), you can see nice type hints for action payload content.

#### Extending action creators

If you need to add new logic to existent action creator or change it's arguments list, you can use the `extend` method of action creator builder. Note that payload of extended action creator should be compatible with parent's payload (type hinting will notify you about this). 

```js
// counter-actions.ts

export const counterDoubleIncrease = actionBuilder.extend(counterIncrease, (amount: number = 1) => ({ amount: amount * 2 }))
```

The extended action creater will receive the same type as parent, so you don't need to make any changes in reducer: if parent action creator is handled in reducer, then all it's chidlrens will be handled too.

### Alternative option: With action constants

If you want to define actions constants, Redux Ease also can help you to simplify this task:

```js
// counter-actions.ts

// Type hinting knows that `counterActions` has `INCREASE` and `TO_ZERO` properties.
export const counterActions = actionBuilder.getConstants(['INCREASE', 'TO_ZERO'])

/*
  `counterActions` equals {
    INCREASE: 'COUNTER_INCREASE',
    TO_ZERO: 'COUNTER_TO_ZERO'
  }
*/
```

Alternatively, if you prefer to create actions manualy you can do this:

```js
// counter-actions.ts

export const INCREASE = actionBuilder.getConst('INCREASE') // equals 'COUNTER_INCREASE'
```

Then, let's create reducer:

```js
// counter-reducer.ts

export const counterReducer = getReducerBuilder(initialState)
  .copyState()
  .handle(counterActions.INCREASE, (s, a) => ({ value: s.value + a.payload.amount }))
  .hanlde(counterActions.TO_ZERO, () => ({ value: 0 })
  .build()
```

Unfortunately, type hinting doesn't know action's payload type in this case. However, if you're usng TypeScript, you can specify it manyally:

```js
  // Note that instead of writing payload typings here you can write them in separate .d.ts file. 
  .handle<{ amount: number }>(counterActions.INCREASE, (s, a) => ({ value: s.value + a.payload.amount }))
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
  .handle(counterIncrease, (s, a) => s.set('value', s.value + a.payload.amount))
  .hanlde(counterToZero, () => s.set('value', 0)
  .build()
```

That's it!

## API

#### ActionCreatorBuilder
See interface declaration in [`./types/IActionCreatorBuilder.d.ts`](https://github.com/queses/redux-ease/blob/master/types/IActionCreatorBuilder.d.ts) 👀

#### ReducerBuilder
See interface declaration in [`./types/IReducerBuilder.d.ts`](https://github.com/queses/redux-ease/blob/master/types/IReducerBuilder.d.ts) 👀

