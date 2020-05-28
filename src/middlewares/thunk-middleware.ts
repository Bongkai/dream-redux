/* Author: https://github.com/reduxjs/redux-thunk */
/* Version: 2.3.0 */

import { Store } from 'redux'
import { Mutation } from '../types'

export const thunkMiddleware = ({ dispatch, getState }: Store) => (
  next: Function,
) => (mutation: Mutation | Function) => {
  if (typeof mutation === 'function') {
    return mutation(dispatch, getState)
  } else {
    return next(mutation)
  }
}
