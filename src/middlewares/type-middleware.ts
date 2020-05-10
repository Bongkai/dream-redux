export const typeMiddleware = (store: any) => (next: Function) => (
  mutation: any,
) => {
  if (mutation.target) {
    mutation.type = `@@${mutation.target}/${mutation.type}`
  }
  return next(mutation)
}
