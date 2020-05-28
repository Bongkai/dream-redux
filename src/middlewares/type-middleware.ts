import { Store } from 'redux'
import { Mutation } from '../types'

export const typeMiddleware = (store: Store) => (next: Function) => (
  mutation: Mutation,
) => {
  if (mutation.target && !Array.isArray(mutation.target)) {
    const type = mutation.type || '^COMMIT^_^MUTATION^'
    mutation.$type = `@@${mutation.target}/${type}`
  }
  return next(mutation)
}
