English | [简体中文](./README.zh-CN.md)

# dream-redux
A fast-zero-build redux framework for react apps.

## Introduction
**dream-redux** is an integration framework for developers to use redux fast and easily.
 It provides the conveniences to set up redux series and many APIs for coding efficiently.

## Installation
```ssh
npm install --save dream-redux
```

## Table of contents
* [Quick start](#Quick-start)
* [Concept](#Concept)
* [Motivation & Advantage](#Motivation-&-Advantage)
* [API Basic Usage](#API-Basic-Usage)
  * [StoreCreator](#StoreCreator(config))
  * [useSelector](#useSelector(selectorFunc))
  * [connect](#connect(mapStateToProps))
  * [setReducer](#setReducer(target,-operation,-[returnPromise]))
  * [commitMutation](#commitMutation(mutation,-[returnPromise]))
* [API Advanced Usage](#API-Advanced-Usage)
  * [Mutating multiple reducers at the same time](#Mutating-multiple-reducers-at-the-same-time)
  * [Asynchronous mutation](#Asynchronous-mutation)
  * [Return Promise and get the latest state](#Return-Promise-and-get-the-latest-state)
  * [Persistence storage](#Persistence-storage)

## Quick start
1. Initialize a *store* instance:
```js
// src/store/index.js

import { StoreCreator } from 'dream-redux'

export const { store, useSelector, setReducer, commitMutation } = new StoreCreator({
  reducerConfig: {
    name: 'app',
    initialState: {
      // state to be managed, eg:
      count: 0,
      list: []
    }
  }
})
```

2. Import *store* in the root file:
```js
// src/index.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'dream-redux'
import { store } from './store/index.js'
import App from './App.jsx'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
```

The initiation is completed and get ready to code! It is just so easy and more surprises are coming.

## Concept
According to redux's design, the whole *state* which want to be managed is put in a single store instance, and we call it **store_state** next.

*Reducers* is written to manage state. *store_state* can use a single reducer, we call it *single-reducer* mode; or split into partial states and use many reducers, and call it *multi-reducers* mode. Each partial state managed by a reducer is called **reducer_state** in the following introduction.

The regular redux coding is complex and confused to the beginners so it keeps them away. And this is what *dream-redux* want to solve.

## Motivation & Advantage
**dream-redux** works with redux and a powerful immutable repo —— *Immer.js*, and enhances *action* to *mutation*. You can mutate *reducer_state* "directly" in *mutation*, and then emit with a dispatch function —— *commitMutation*, and then an update process is done.

## API Basic Usage

#### `StoreCreator(config)`
A class to create *store* and a series of APIs
- parameter **`config`** *object* 
  - **reducerConfig** *object* | *array* : *required*, reducers config, divided into *single-reducer* mode and *multi-reducers* mode
    - **name** *string* : *required*, reducer name, used as *store_state* field and *mutation* target
    - **initialState** *object* : *required*, *reducer_state* structure and initialValue
    - **persist** *object* : *optional*, is the same as *persistConfig* in *redux-persist*
  - **allowOperationReturns** *boolean* : *optional*, set `true` to allow returning value in *operation* function body; by default it can only mutate state directly and returns will be ignored
- returns: `{ store, useSelector, setReducer, commitMutation, persistor }`

**Example**
```js
import { StoreCreator } from 'dream-redux'

// single-reducer mode
const config = {
  reducerConfig: {
    name: 'app',
    initialState: {
      count: 0,
      list: []
    }
  }
}

// Or:
// multi-reducers mode
// Notice: Even there is only one reducer in reducerConfig is regarded as multi-reducers if config's type is array
const config = {
  reducerConfig: [
    {
      name: 'app',
      initialState: {
        count: 0,
        list: []
      }
    },
    {
      name: 'counter',
      initialState: {
        count: 0
      }
    },
  ]
}

export const { store, persistor, useSelector, setReducer, commitMutation } = new StoreCreator(config)
```

#### `useSelector(selectorFunc)`
A hook to get target state in hook components, is the same as *useSelector* in react-redux

**Example**
```js
import React from 'react'
import { useSelector } from '@/store/index.js' // store dir relative path

export default function Example() {
  const count = useSelector(state => state.count)
  const list = useSelector(state => state.list)
  console.log('count', count)  // 'count', 0
  console.log('list', list)    // 'list', []

  return <div></div>
}
```

#### `connect(mapStateToProps)`
A HOC to get target state in class components, is the same as *connect* with param *mapStateToProps* in react-redux, and param *mapDispatchToProps* is unnecessary, use *commitMutation* to dispatch instead.

**Example**
```js
import React from 'react'
import { connect } from 'dream-redux'

const connectWrapper = connect(state => state)

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.exampleMethod = this.exampleMethod.bind(this)
  }

  exampleMethod() {
    const { count, list } = this.props
    console.log('count', count)  // 'count', 0
    console.log('list', list)    // 'list', []
  }

  render() {
    return <div></div>
  }
}

export default connect(Example)
```

#### `setReducer(target, operation, [returnPromise])`
Basic *dispatch* API to mutate *reducer_state* directly
- parameter **`target`** *string* : *required*, specify reducer's *name* field
- parameter **`operation`** *function* : *required*, privide target *reducer_state* to mutate directly in function body
- parameter **`returnPromise`** *boolean* : *optional*, `false` by default, set `true` to return Promise when dispatching

**Example**
```js
import React from 'react'
import { setReducer } from '@/store/index.js' // store dir relative path

export default function Example() {
  setReducer('app', state => {
    state.count++
    state.list.push('This is an example text')
  })

  return <div></div>
}
```

#### `commitMutation(mutation, [returnPromise])`
Core *dispatch* API, the advanced version of *setReducer*
- parameter **`mutation`** *object* | *function* | *array*: *required*, usually written as a creator function that returns a *mutation object* obtains all update infomation, and run with necessary params in *commitMutation*; it also can be presented as a function returns *Promise* when handling async code
  - **type** *string* : *optional*, a flag used for process tracing
  - **target** *string* | *array* : *required*, specify reducer(s)'s *name* field
  - **operation** *function* | *array* : *required*, privide target *reducer_state* to mutate directly in function body
- parameter **`returnPromise`** *boolean* : *optional*, `false` by default, set `true` to return Promise when dispatching

**Example**
```js
import React from 'react'
import { commitMutation } from '@/store/index.js' // store dir relative path

export default function Example() {
  const mutationCreator = listItem => {
    // return a mutation object
    return {
      type: 'EXAMPLE_A',
      target: 'app',
      operation: state => {
        // state here is store_state in single-reducer mode and reducer_state in multi-reducer mode
        state.list.push(listItem)
      }
    }
  }

  // basic usage
  commitMutation(mutationCreator('This is an example text'))

  return <div></div>
}
```

## API Advanced Usage

### Mutating multiple reducers at the same time
When *store_state* is divided into several *reducer_state* and a mutation wants to update some of them at the same time, we provide a format to fit it. This can only be used in *commitMutation's* mutationCreator.

```js
// mutations.js

export const mutationCreator = listItem => ({
  type: 'EXAMPLE_PROMISE',
  target: ['app', 'counter'],
  operation: [
    state => {
      // reducer_state of reducer named app
      state.list.push(listItem)
    },
    state => {
      // reducer_state of reducer named counter
      state.count++
    }
  ]
})
```

### Asynchronous mutation
If you want to wait for a http request and update the resonse to state, or using timer function like *setTimeout* to dispatch asynchronously, you can try the following mutationCreator format. It works as what *redux-thunk* does.

- deal with **HTTP request**
```js
// mutations.js

export const mutationCreator = () => {
  return (dispatch, getState) => {
    return SomeHttpRequest().then(res => {
      console.log(res)  // { data: 'This is data from a http request' }
      console.log(getState())  // store_state

      dispatch({
        type: 'EXAMPLE_PROMISE',
        target: 'app',
        operation: state => {
          state.list.push(res.data)
        }
      })
    })
  }
}
```

- deal with **setTimeout**
```js
// mutations.js

export const mutationCreator = () => {
  return dispatch => {
    // wrap setTimeout with a Promise and resolve in it
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch({
          type: 'EXAMPLE_SETTIMEOUT',
          target: 'app',
          operation: state => {
            state.list.push(res.data)
          }
        })
        resolve()
      }, 2000)
    })
  }
}
```

### Return Promise and get the latest state
In regular redux, you cannot get latest *store_state* immediately after *dispatch*, but now it come true if you set the last parameter to `true` in *setReducer* and *commitMutation* and it will return a Promise with latest *store_state*.

*Notice: This is not a stable function yet, please feedback via Issue if it doesn't work.*

```js
import React from 'react'
import { setReducer } from '@/store/index.js' // store dir relative path

export default function Example() {
  setReducer('app', state => {
    state.count++
  }, true).then(state => {
    // state is the latest store_state
    console.log(state.count)  // 1
  })

  const mutationCreator = listItem => ({
    type: 'EXAMPLE_A',
    target: 'app',
    operation: state => {
      state.list.push(listItem)
    }
  })

  commitMutation(mutationCreator('This is an example text'), true).then(state => {
    // state is the latest store_state
    console.log(state.list)  // ['This is an example text']
  })

  return <div></div>
}
```

### Persistence storage
Since the page refresh or reload, *store* will be recreate and the previous *store_state* will be reset. If you would like to storage some or all of them, you may configurate the *persist* field in the config of *StoreCreator* in initialization. It works as `persistConfig` in *redux-persist*.

```js
// src/store/index.js

const config = {
  reducerConfig: [
    {
      name: 'app',
      initialState: {
        count: 0,
        list: []
      },
      persist: {
        whitelist: ['list']  // fields in whitelist will be cached
        // blacklist: ['list']  // and fields in whitelist will not be cached
      }
    },
    {
      name: 'counter',
      initialState: {
        count: 0
      },
      persist: {}  // all the fields of this reducer_state will be cached
    },
  ]
}

export const { store, persistor, useSelector, setReducer, commitMutation } = new StoreCreator(config)
```

And then import *persistor* with *PersistGate* in the root file:
```js
// src/index.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, PersistGate } from 'dream-redux'
import { store, persistor } from './store/index.js'
import App from './App.jsx'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)
```
