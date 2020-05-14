import { AnyAction } from 'redux'
import { WebStorage } from 'redux-persist'

export interface StoreConfig {
  reducerConfig: ReducerConfig | ReducerConfig[]
  allowOperationReturns?: boolean
  logger?: boolean
}

export interface ReducerConfig {
  name: string
  initialState: PlainObject
  persist?: PersistConfig
}

export interface Mutation extends AnyAction {
  type: string
  target: string | string[]
  operation: Operation | Operation[]
}

export type Operation = (state: PlainObject) => void | PlainObject

export interface PlainObject {
  [key: string]: any
}

interface PersistConfig {
  key?: string
  storage?: WebStorage
  whitelist?: string[]
  blacklist?: string[]
}
