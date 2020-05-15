import { AnyAction } from 'redux'
import { WebStorage } from 'redux-persist'

export interface StoreConfig {
  reducerConfig: ReducerConfig | ReducerConfig[]
  allowOperationReturns?: boolean
  logger?: boolean
}

export interface ReducerConfig {
  name: string
  initialState: PlainObjectState
  persist?: PersistConfig
}

export interface Mutation extends AnyAction {
  type: string
  target: string | string[]
  operation: Operation | Operation[]
}

export type Operation = (state: PlainObjectState) => void | PlainObjectState

export interface PlainObjectState {
  [key: string]: any
}

type PersistConfig = {
  version?: number
  storage?: WebStorage
  key?: string
  keyPrefix?: string
  blacklist?: Array<string>
  whitelist?: Array<string>
  throttle?: number
  debug?: boolean
  timeout?: number
}
