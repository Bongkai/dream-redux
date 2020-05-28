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

export interface PlainObject {
  [key: string]: any
}

export interface Mutation extends PlainObject {
  type?: string
  target?: string | string[]
  operation?: Operation | Operation[]
  promise?: Promise<any>
  pending?: PromiseStatusItem
  success?: PromiseStatusItem
  fail?: PromiseStatusItem
}

export interface PromiseStatusItem {
  target?: string | string[]
  operation?: Operation | Operation[]
}

export type Operation = (state: PlainObject) => void | PlainObject

export type InternalOperation = (
  state: PlainObject,
  flag: string,
) => void | PlainObject

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
