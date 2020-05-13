English | [简体中文](./README.zh-CN.md)

# dream-redux
A fast-zero-build redux framework for react apps.

*Notice: English document is undone yet, and more details are coming soon.*

## Introduction
**dream-redux** is an integration framework for developers to use redux fast and easily.
 It provides the conveniences to set up redux series and many APIs for coding efficiently.

## Installation
```ssh
npm install --save dream-redux
```

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

The regular redux coding is complex and confused to the beginners so it keep them away. And this is what *dream-redux* want to solve.

## Motivation & Advantage
**dream-redux** works with redux and a powerful immutable repo —— *Immer.js*, and enhances *action* to *mutation*. You can mutate *reducer_state* "directly" in *mutation*, and then emit with a dispatch function —— *commitMutation*, and then an update process is done.

## API Basic Usage

#### `StoreCreator(config)`
- a class to create *store* and a series of APIs
- parameter **`config`** *object*
  - **reducerConfig** *object* | *array* : reducers config, with *single-reducer* mode and *multi-reducers* mode
    - **name** *string*
    - **initialState** *object*
    - **persist** *object*
  - **returnPromise** *boolean*
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

#### `useSelector(callback)`
- get target state in *store_state*, is the same as *useSelector* in react-redux repo

**Example**
```js
import React from 'react'
import { useSelector } from '@/store/index.js' // store dir relative path

export default Example() {
  const { count } = useSelector(state => state)
  const list = useSelector(state => state.list)
  console.log('count', count)  // 'count', 0
  console.log('list', list)    // 'list', []

  return <div></div>
}
```

#### `setReducer(target, operation, [returnPromise])`
- basic *dispatch* API to mutate *reducer_state* directly 
- parameter **`target`** *string*
- parameter **`operation`** *function*
- parameter **`returnPromise`** *boolean*

**Example**
```js
import React from 'react'
import { setReducer } from '@/store/index.js' // store dir relative path

export default Example() {
  setReducer('app', state => {
    state.count++
    state.list.push('This is an example text')
  })

  return <div></div>
}
```

#### `commitMutation(mutation, [returnPromise])`
- core *dispatch* API，the advanced version of *setReducer*
- parameter **`mutation`** *object*
  - **type** *string*
  - **target** *string* | *array*
  - **operation** *function* | *array* 
- parameter **`returnPromise`** *boolean* 

**Example**
```js
import React from 'react'
import { commitMutation } from '@/store/index.js' // store dir relative path

export default Example() {
  const mutationCreator = listItem => {
    // return a mutation object
    return {
      type: 'EXAMPLE_A',
      target: 'app',
      operation: state => {
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

### Async mutation

- HTTP request
```js
// mutations.js

export const mutationCreator = () => {
  return (dispatch, getState) => {
    SomeHttpRequest().then(res => {
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

- setTimeout
```js
// mutations.js

export const mutationCreator = () => {
  return dispatch => {
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

### Returns Promise and get the latest state

```js
import React from 'react'
import { setReducer } from '@/store/index.js' // store dir relative path

export default Example() {
  setReducer('app', state => {
    state.count++
  }, true).then(state => {
    // state is the latest
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
    // state is the latest
    console.log(state.list)  // ['This is an example text']
  })

  return <div></div>
}
```

### Persistence storage

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
        whitelist: ['list']
        // blacklist: ['list']
      }
    },
    {
      name: 'counter',
      initialState: {
        count: 0
      },
      persist: {}  // all the fields of this reducer_state would be persisted
    },
  ]
}

export const { store, persistor, useSelector, setReducer, commitMutation } = new StoreCreator(config)
```

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
