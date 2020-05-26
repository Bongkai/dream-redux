import { createStore, applyMiddleware, Store } from 'redux'
import { useSelector } from 'react-redux'
import { persistStore, Persistor } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineReducers } from './combineReducers'
import { defaultConfig } from './defaultConfig'
import { isPromise } from './tools'
import logger from 'redux-logger'
import { thunkMiddleware, multiMiddleware, typeMiddleware } from './middlewares'
import { StoreConfig, Operation, Mutation } from './types'

export class StoreCreator {
  store: Store
  useSelector = useSelector
  persistor: Persistor

  constructor(userConfig: StoreConfig, userMiddlewares: any[] = []) {
    const config = Object.assign({}, defaultConfig, userConfig)

    const middlewares: any[] = [
      thunkMiddleware,
      multiMiddleware,
      ...userMiddlewares,
      typeMiddleware,
    ]
    if (config.logger === true) {
      middlewares.push(logger)
    }

    this.store = createStore(
      combineReducers(config),
      composeWithDevTools(applyMiddleware(...middlewares)),
    )

    this.persistor = persistStore(this.store)

    this.setReducer = this.setReducer.bind(this)
    this.commitMutation = this.commitMutation.bind(this)
  }

  // 修改和 name 对应的 reducer 的数据
  setReducer(
    name: string,
    operation: Operation,
    returnPromise: boolean = false,
  ) {
    const mutation: Mutation = {
      type: `^OPERATE^_^REDUCER^`,
      target: name,
      operation: operation,
    }

    return this._execDispatch(mutation, returnPromise)
  }

  // 提交处理 mutation
  commitMutation(mutation: any, returnPromise: boolean = false) {
    return this._execDispatch(mutation, returnPromise)
  }

  async _execDispatch(mutation: any, returnPromise: boolean) {
    let ret: any
    if (Array.isArray(mutation)) {
      const retArr: any[] = mutation.map(item => {
        return this.store.dispatch(item)
      })
      ret = Promise.all(retArr)
    } else {
      ret = this.store.dispatch(mutation)
    }

    if (returnPromise === true) {
      if (isPromise(ret)) {
        return ret.then(() => {
          return Promise.resolve(this.store.getState())
        })
      }
      return Promise.resolve(this.store.getState())
    }
  }
}
