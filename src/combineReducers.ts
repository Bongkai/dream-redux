import { combineReducers as combine, Reducer } from 'redux'
import { persistReducer, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { createReducer } from './createReducer'
import { StoreConfig, ReducerConfig } from './types'

interface Reducers {
  [name: string]: Reducer
}

export function combineReducers(config: StoreConfig) {
  const { reducerConfig: reducersConfig, allowOperationReturns } = config

  if (!Array.isArray(reducersConfig)) {
    if (reducersConfig.persist) {
      const persistConfig = _createPersistConfig(reducersConfig)
      return persistReducer(
        persistConfig,
        createReducer(reducersConfig, allowOperationReturns),
      )
    } else {
      return createReducer(reducersConfig, allowOperationReturns)
    }
  }

  const reducers = {} as Reducers

  reducersConfig.forEach(itemConfig => {
    if (itemConfig.persist) {
      const persistConfig = _createPersistConfig(itemConfig)
      reducers[itemConfig.name] = persistReducer(
        persistConfig,
        createReducer(itemConfig, allowOperationReturns),
      )
    } else {
      reducers[itemConfig.name] = createReducer(
        itemConfig,
        allowOperationReturns,
      )
    }
  })

  return combine(reducers)
}

function _createPersistConfig(reducerConfig: ReducerConfig) {
  const persistConfig: PersistConfig<any> = {
    key: reducerConfig.persist
      ? reducerConfig.persist.key || reducerConfig.name
      : reducerConfig.name,
    storage: reducerConfig.persist
      ? reducerConfig.persist.storage || storage
      : storage,
    ...reducerConfig.persist,
  }
  return persistConfig
}
