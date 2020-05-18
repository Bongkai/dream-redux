import { Mutation } from '../types'

export const multiMiddleware = ({ dispatch }) => (next: Function) => (
  mutation: Mutation,
) => {
  const { type, target, operation } = mutation
  if (Array.isArray(operation)) {
    if (!Array.isArray(target) || target.length !== operation.length) {
      throw new Error('The mutation target is not match operation.')
    }

    for (let i = 0; i < operation.length; i++) {
      dispatch({
        type: type,
        target: target[i],
        operation: operation[i],
      })
    }
    return
  } else {
    return next(mutation)
  }
}
