import { Store } from 'redux'
import { Mutation, PromiseStatusItem } from '../types'
import { isPromise } from '../tools'

export const promiseMiddleware = ({ dispatch }: Store) => (next: Function) => (
  mutation: Mutation,
) => {
  if (mutation.promise && isPromise(mutation.promise)) {
    if (mutation.operation) {
      console.warn(
        `Mutation.operation does not work when mutation.promise exists`,
      )
    }

    const { type, target, pending, success, fail } = mutation
    const mutationCreator = (
      status: PromiseStatusItem,
      flag: string,
      payload?: any,
    ) => {
      if (!status.target && !target) {
        console.warn(
          `Field 'target' in ${type} must be specified in mutation or ${flag} item.`,
        )
      }

      return {
        type: `${type}__${flag}`,
        target: status.target || target,
        operation: status.operation,
        __promise__: true,
        $payload: payload,
      }
    }

    pending && dispatch(mutationCreator(pending, 'PENDING'))

    mutation.promise
      .then(res => {
        success && dispatch(mutationCreator(success, 'FULFILLED', res))
      })
      .catch(err => {
        fail && dispatch(mutationCreator(fail, 'REJECTED', err))
      })
  } else {
    return next(mutation)
  }
}
