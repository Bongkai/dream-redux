import { Mutation } from '../types'

export const typeMiddleware = (store: any) => (next: Function) => (
  mutation: Mutation,
) => {
  if (mutation.target) {
    const type = mutation.type || '^COMMIT^_^MUTATION^'
    mutation.$type = `@@${mutation.target as string}/${type}`
  }
  return next(mutation)
}
