import { produce } from 'immer'

import { ReducerConfig, PlainObject, Mutation } from './types'

export const createReducer = (
  reducerConfig: ReducerConfig,
  allowOperationReturns: boolean = false,
) => (state = reducerConfig.initialState, mutation: Mutation) => {
  return produce(state, (draft: PlainObject) => {
    if (
      mutation.$type &&
      mutation.$type.startsWith(`@@${reducerConfig.name}/`)
    ) {
      const { operation } = mutation

      if (Array.isArray(operation)) {
        throw new Error(
          'Final operation dispatched to reducer cannot be an array.',
        )
      }

      let ret: void | PlainObject
      if (mutation.__promise__) {
        ret =
          operation &&
          typeof operation === 'function' &&
          (operation as any)(draft, mutation.$payload)
      } else {
        ret = operation && typeof operation === 'function' && operation(draft)
      }

      if (allowOperationReturns === true) {
        return ret
      } else if (ret) {
        console.warn(
          `Returning value in mutation.operation is not allowed in '${mutation.$type}', please mutate state directly or set 'allowOperationReturns' in storeConfig.`,
        )
      }
    }
  })
}
