import { produce } from 'immer'

import { AnyAction } from 'redux'
import { ReducerConfig, PlainObject } from './types'

export const createReducer = (reducerConfig: ReducerConfig) => (
  state = reducerConfig.initialState,
  mutation: AnyAction,
) => {
  return produce(state, (draft: PlainObject) => {
    if (mutation.type.startsWith(`@@${reducerConfig.name}/`)) {
      return mutation.operation && mutation.operation(draft)
    }
  })
}
