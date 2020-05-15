/* Author: https://github.com/reduxjs/redux-thunk */
/* Version: 2.3.0 */

import { Mutation } from 'src/types'

export const thunkMiddleware = ({ dispatch, getState }) => (next: Function) => (
  mutation: Mutation | Function,
) => {
  if (typeof mutation === 'function') {
    return mutation(dispatch, getState)
  } else {
    return next(mutation)
  }
}
