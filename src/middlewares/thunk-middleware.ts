/* Author: https://github.com/reduxjs/redux-thunk */
/* Version: 2.3.0 */

export const thunkMiddleware = ({ dispatch, getState }) => (next: Function) => (
  mutation: any,
) => {
  if (typeof mutation === 'function') {
    return mutation(dispatch, getState)
  } else {
    return next(mutation)
  }
}
