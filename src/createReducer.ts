import { produce } from 'immer'

import { AnyAction } from 'redux'
import { ReducerConfig, PlainObject } from './types'

export const createReducer = (
  reducerConfig: ReducerConfig,
  allowOperationReturns: boolean = false,
) => (state = reducerConfig.initialState, mutation: AnyAction) => {
  return produce(state, (draft: PlainObject) => {
    if (mutation.type.startsWith(`@@${reducerConfig.name}/`)) {
      const ret = mutation.operation && mutation.operation(draft)
      if (allowOperationReturns === true) {
        return ret
      } else if (ret) {
        console.warn(
          `Returning value in mutation.operation is not allowed in '${mutation.type}', please mutate state directly or set 'allowOperationReturns' in storeConfig.`,
        )
      }
    }
  })
}
