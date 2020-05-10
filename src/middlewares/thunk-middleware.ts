export const thunkMiddleware = ({ dispatch, getState }) => (next: Function) => (
  mutation: any,
) => {
  if (typeof mutation === 'function') {
    return mutation(dispatch, getState)
  } else {
    return next(mutation)
  }
}
