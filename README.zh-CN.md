[English](./README.md) | 简体中文

# dream-redux
一个开箱即用，简易更新的 redux 集成库。

## 简介
**dream-redux** 是一个专门为想快速使用 redux 的开发者打造的框架，只需要写两处代码便可在 react 项目上完成 redux 家族库的搭建，并且提供了多种简化功能，使项目代码更加高效简洁。你只需要有 react 的基础知识，便能借助 **dream-redux** 轻松开发具备状态管理功能的项目了。

## 安装
```ssh
npm install --save dream-redux
```

## 目录
* [开始使用](#开始使用)
* [了解概念](#了解概念)
* [项目优势](#项目优势)
* [API 基本用法](#API-基本用法)
  * [StoreCreator](#StoreCreator)
  * [useSelector](#useSelector)
  * [connect](#connect)
  * [setReducer](#setReducer)
  * [commitMutation](#commitMutation)
* [API 高级用法](#API-高级用法)
  * [同时修改多个 reducer_state](#同时修改多个-reducer_state)
  * [在 mutation 中进行异步操作](#在-mutation-中进行异步操作)
  * [在 Promise 的不同状态阶段分别派发 mutation](#在-Promise-的不同状态阶段分别派发-mutation)
  * [dispatch 后获取最新的 store_state](#dispatch-后获取最新的-store_state)
  * [状态持久化存储](#状态持久化存储)

## 开始使用
1. 在 *src/store/index.js* 中初始化 store 实例：
```js
// src/store/index.js

import { StoreCreator } from 'dream-redux'

export const { store, useSelector, setReducer, commitMutation } = new StoreCreator({
  reducerConfig: {
    name: 'app',
    initialState: {
      // 这里输入需要进行管理的状态，如：
      count: 0,
      list: []
    }
  }
})
```

2. 在 react 项目根文件中引入 store 实例：
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

这样，redux 的搭建就已经完成，可以进行项目代码的开发了。无需动手配置搭建 redux，react-redux，redux-persist 等 js 库，是不是有点意思！别着急，后面还有更多诱人的功能等着你呢！^_^

## 了解概念
根据 redux 的架构设计，状态 state 由 store 对象管理，后文用 **store_state** 代称。

负责更新 state 的模块称为 reducer，store_state 可以只由一个 reducer 负责，称为*单 reducer 模式*。也可以分割成多个 partial state，分别交给多个 reducers 管理，称为*多 reducers 模式*。每个 reducer 管理的那一部分 state 在后文用 **reducer_state** 代称。

在 redux 的设计理念中，state 是不能被直接修改的，只能使用 store.dispatch 向 reducer 派发带有修改信息的 action，reducer 中根据 action.type 匹配到指定的修改逻辑，修改后把新的 reducer_state 返回给 store 做后续的操作。

这个过程中，当 reducer 接收到 action 后，逻辑代码不能直接对现在的 reducer_state 进行修改，而是需要构造一个全新的 reducer_state，在新 reducer_state 上做修改后返回给 store。这使得处理层级较深的 reducer_state 树时会非常麻烦，也容易出现错误。

看到这里，刚接触 redux 的朋友是不是被这个更新流程给绕晕了，再加上繁琐的初始搭建过程，使其对新手特别不友好，这也是 redux 受人诟病的缺点之一。而这也就是 dream-redux 想要解决的问题。

## 项目优势
**dream-redux** 通过一个强大的 immutable 库 —— Immer.js 与 redux 相结合，并把 action 改造成 mutation，让开发者可以在 mutation 中 “直接” 对 reducer_state 进行修改。然后通过封装过的 dispatch 方法 —— *commitMutation* 把 mutation 当作参数执行一下，就完成了一次状态更新。无需构建 reducer 函数，无需在修改 state 后构造一个新的 state 返回，不仅减少了大量的重复代码，还降低了出错的概率。

**dream-redux** 的优势主要有：
- 无需进行繁琐的初始化过程，redux 系列库和中间件的搭建仅用一行代码搞定
- 无需手写 reducer，只需要在 StoreCreator 实例化时传入 name，initialState 等配置项就能自动构建 reducer
- mutation.type 可以根据需要选择不同的书写规范，无需让 type 在多个文件中反复横跳，甚至可以省略不写
- 最重要的，在 mutation.operation 中可以直接修改 reducer_state，无需自己构造全新的返回值

## API 基本用法

#### `StoreCreator`
创建核心对象 store 和一系列 api 的类
- 用法 `new StoreCreator(config, [middlewares])`
- 参数 **`config`** *object*
  - **reducerConfig** *object* | *array* : 必填项，reducers 的配置，格式分为单 reducer 和多 reducers 两种模式，以下为每个 reducer 的配置项：
    - **name** *string* : 必填项，对应 reducer 的 name，在多 reducers 时作为 store_state 的属性名，以及 mutation 中指定 reducer 用的 target
    - **initialState** *object* : 必填项，对应 reducer 的 state 结构和初始值
    - **persist** *object* : 可选项，配置方法同 redux-persist 的 *persistConfig*
  - **allowOperationReturns** *boolean* : 可选项，设为 `true` 允许通过在 operation 中返回自己构造的新 state 来更新状态；默认是只能直接修改 state，返回值会被忽略
  - **logger** *boolean* : 可选项，设为 `true` 时开启 redux-logger 中间件
- 参数 **`middlewares`** *array* : 可选项，需要添加中间件时以数组形式传入
- 返回项： `{ store, useSelector, setReducer, commitMutation, persistor }`

```js
import { StoreCreator } from 'dream-redux'

// 单 reducer 配置
const config = {
  reducerConfig: {
    name: 'app',
    initialState: {
      count: 0,
      list: []
    }
  }
}

// 或者：
// 多 reducers 配置
// 注意：当 reducerConfig 为数组时，即使只有一个 reducer 也视作多 reducers 配置
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

### `useSelector`
在 hook 组件中获取目标 state 的方法，等同于 react-redux 的 useSelector
- 用法 `useSelector(selectorFunc)`

```js
import React from 'react'
import { useSelector } from '@/store/index.js' // store 文件夹的相对目录

export default function Example() {
  const count = useSelector(state => state.count)
  const list = useSelector(state => state.list)
  console.log('count', count)  // 'count', 0
  console.log('list', list)    // 'list', []

  return <div></div>
}
```

### `connect`
在 class 组件中获取目标 state 的 HOC 方法，等同于 react-redux 的 connect，只需传入 mapStateToProps 参数即可，派发 mutation 的方式用 commitMutation 代替
- 用法 `connect(mapStateToProps)`

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

### `setReducer`
最基础的 *dispatch* API，可直接在 operation 中修改指定 target 的 reducer（简单粗暴 & 不常用）
- 用法 `setReducer(target, operation, [returnPromise])`
- 参数 **`target`** *string* : 必填项，目标 reducer 的 name
- 参数 **`operation`** *function* : 必填项，可在方法体中直接修改指定 target 的 reducer_state
- 参数 **`returnPromise`** *boolean* : 可选项，值为 `true` 时 setReducer 执行后会返回一个 Promise 对象

```js
import React from 'react'
import { setReducer } from '@/store/index.js' // store 文件夹的相对目录

export default function Example() {
  function onBtnClick() {
    // 最基本的用法，直接在 state 上修改，无需通过常规的 dispatch(action) -> reducer 即可更新 reducer_state
    setReducer('app', state => {
      // state 在单 reducer 时是 store_state，多 reducers 时是 name 为 app 的 reducer_state，类型均为 Proxy
      state.count++
      state.list.push('这是一条测试文字')
    })
  }
  
  return <button onClick={onBtnClick}>SetReducer</button>
}
```

### `commitMutation`
核心 *dispatch* API，具有更新 reducer_state 的全部功能，高级版的 setReducer（正式项目中使用）
- 用法 `commitMutation(mutation, [returnPromise])`
- 参数 **`mutation`** *object* | *function* | *array* : 必填项，常见写法为构造一个返回 mutation 对象的函数，然后在 commitMutation 中传入参数执行；mutation 的属性如下：
  - **type** *string* : 可选项，此次 dispatch 行为的类型标记，为求更新过程可追踪，一般都会填
  - **target** *string* | *array* : 必填项，目标 reducer 的 name
  - **operation** *function* | *array* : 必填项，可在方法体中直接修改指定 target 的 reducer_state
- 参数 **`returnPromise`** *boolean* : 可选项，值为 `true` 时 commitMutation 执行后会返回一个 Promise 对象

*setReducer* 和 *commitMutation* 虽然更新 reducer_state 的方式和常规 redux 不同，但仍旧遵循 redux 的工作原理，即每次命令 reducer 更新后返回一个全新的 reducer_state 对象，再让其触发 react 的重新渲染

```js
import React from 'react'
import { commitMutation } from '@/store/index.js' // store 文件夹的相对目录

export default function Example() {
  function onBtnClick() {
    const mutationCreator = listItem => {
      // 返回 mutation 对象
      return {
        type: 'EXAMPLE_A',
        target: 'app',
        operation: state => {
          // state 在单 reducer 时是 store_state，多 reducers 时是 name 为 app 的 reducer_state，类型均为 Proxy
          state.list.push(listItem)
        }
      }
    }

    // 基本用法
    commitMutation(mutationCreator('这是一条测试文字'))
  }
  
  return <button onClick={onBtnClick}>CommitMutation</button>
}
```

## API 高级用法

### 同时修改多个 reducer_state
项目开发中，出于功能划分和性能优化的考虑，我们可以把 state 划分到多个 reducers 中。这就不可避免会出现同时修改多个 reducers 中的某几个状态的情况。
- setReducer 并不具备一对多的更新操作，只能对每个要更新的 reducer 专门进行一次 setReducer 操作。
- commitMutation 则可以在只派发一次 mutation 的情况下更新多个 reducer_state。

```js
// mutations.js

// 同时更新 app_reducer 的 list 和 counter_reducer 的 count
export const mutationCreator = listItem => ({
  type: 'EXAMPLE_MUTATE_MULTIPLE_STATES',
  target: ['app', 'counter'],
  // operation 数组各子项的 reducer_state 与 target 数组一一对应
  operation: [
    state => {
      // name 为 app 的 reducer_state
      state.list.push(listItem)
    },
    state => {
      // name 为 counter 的 reducer_state
      state.count++
    }
  ]
})
```

### 在 mutation 中进行异步操作
有时候我们需要等待 HTTP 请求返回数据后，或者通过设置定时器来延时进行 dispatch 操作，这些都属于异步操作。但是在 operation 的方法体中，是不允许执行异步代码的。所以我们需要稍微改变一下 mutationCreator 的写法，使其可以和异步代码一起抽离出来，防止业务代码过于冗杂。目前该功能的原理和使用方法与 redux-thunk 库一致。

- 处理 HTTP 请求
```js
// mutations.js

export const mutationCreator = () => {
  return (dispatch, getState) => {
    return SomeHttpRequest().then(res => {
      console.log(res)  // { data: '这是 HTTP 请求返回的数据' }
      console.log(getState())  // store_state

      dispatch({
        type: 'EXAMPLE_PROMISE',
        target: 'app',
        operation: state => {
          // operation 的方法体中只允许对 state 进行同步更新
          state.list.push(res.data)
        }
      })
    })
  }
}
```

- 处理 setTimeout
```js
// mutations.js

export const mutationCreator = () => {
  return dispatch => {
    // 使用 Promise 包裹 setTimeout，在内部 dispatch 后执行 resolve
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch({
          type: 'EXAMPLE_SETTIMEOUT',
          target: 'app',
          operation: state => {
            // operation 的方法体中只允许对 state 进行同步更新
            state.list.push(res.data)
          }
        })
        resolve()
      }, 2000)
    })
  }
}
```

### 在 Promise 的不同状态阶段分别派发 mutation
有时我们在处理 Promise 对象，比如 http 请求时，需要针对 pending，fulfilled 和 rejected 状态分别派发不同的 mutation。使用 redux-thunk 也可以完成以上需求，但需要编写的代码比较繁琐。这时可以使用 redux-promise 功能的中间件进行简化。dream-redux 专门为此设计了一个特殊的 mutation 结构，方便开发者使用。

```js
// mutations.js

export const mutationCreator = () => ({
  type: 'FETCH_HTTP_REQUEST',
  target: 'app',  // 在三个阶段中默认生效，各个阶段都有设置自己的 target 时可以省略
  // 用 promise 承载 Promise，取消 operation
  promise: SomeHttpRequest(),  // Promise 对象
  // pending 状态
  pending: {
    operation: state => {
      // ...
    },
  },
  // fulfilled 状态
  success: {
    target: ['app', 'counter'],  // 各个阶段中可以设定 target 覆盖默认值
    operation: [
      (state, res) => {
        console.log(res)  // res 为 Promise.resolve 返回的值
        // ...
      },
      (state, res) => {
        console.log(res)
        // ...
      },
    ],
  },
  // rejected 状态
  fail: {
    target: ['counter'],
    operation: (state, err) => {
      console.log(err)  // err 为 Promise.reject 返回的值
      // ...
    },
  },
})
```

### dispatch 后获取最新的 store_state
下面介绍不同情况下获取 dispatch 后的最新 store_state 的方法：

1. 单次或多次 dispatch 同步 mutation，直接通过 store.getState() 同步获取

2. 单次 dispatch 异步 mutation，通过 then 获取

3. 想要 dispatch 多个异步 mutation ，等到所有 mutation 都完成更新后再获取最新 store_state，可以将多个 mutation 以数组形式传给 commitMutation，再通过 then 获取

```js
export default function Example() {
  // 同步 mutations
  function runSyncMutations() {
    commitMutation(sync_mutationCreator_1())
    commitMutation(sync_mutationCreator_2())
    console.log(store.getState())  // 直接获取最新 store_state
  }

  // 单个异步 mutation
  function runAsyncMutation() {
    commitMutation(async_mutationCreator(), true).then(state => {
      console.log(state)  // 通过 then 获取最新 store_state
    })
  }

  // 多个异步 mutations
  function runAsyncMutations() {
    commitMutation([async_mutationCreator_1(), async_mutationCreator_2()], true)
      .then(state => {
        console.log(state)  // 通过 then 获取最新 store_state
      })
  }
  
  // return ...
}
```

### 状态持久化存储
正常情况下，当页面刷新或重新加载时，store 会重新生成，之前更新过的状态会被重置。如果有些状态需要存储起来，就需要在 StoreCreator 的 config 中配置 persist 属性，配置项同 redux-persist 的 persistConfig。

```js
// src/store/index.js

const config = {
  reducerConfig: [
    {
      name: 'app',
      initialState: { count: 0, list: [] },
      persist: {
        whitelist: ['list']  // 白名单，只有 list 状态会被缓存
        // blacklist: ['list']  // 黑名单，只有 list 状态不会被缓存
      }
    },
    {
      name: 'counter',
      initialState: { count: 0 },
      persist: {}  // 不设 whitelist 或 blacklist，该 reducer 的所有状态都会被持久化存储
    },
  ]
}

export const { store, persistor, useSelector, setReducer, commitMutation } = new StoreCreator(config)
```

还需要在项目根文件通过 PersistGate 引入 persistor：
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
这样就完成了符合项目需求的持久化配置。
