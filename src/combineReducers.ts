import { combineReducers as combine, Reducer } from 'redux'
import { persistReducer, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { createReducer } from './createReducer'
import { StoreConfig, ReducerConfig } from './types'

interface Reducers {
  [name: string]: Reducer
}

export function combineReducers(config: StoreConfig) {
  const reducersConfig = config.reducer

  if (!Array.isArray(reducersConfig)) {
    if (reducersConfig.persist) {
      const persistConfig = _createPersistConfig(reducersConfig)
      return persistReducer(persistConfig, createReducer(reducersConfig))
    } else {
      return createReducer(reducersConfig)
    }
  }

  const reducers = {} as Reducers

  reducersConfig.forEach(reducerItem => {
    if (reducerItem.persist) {
      const persistConfig = _createPersistConfig(reducerItem)
      reducers[reducerItem.name] = persistReducer(
        persistConfig,
        createReducer(reducerItem),
      )
    } else {
      reducers[reducerItem.name] = createReducer(reducerItem)
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
