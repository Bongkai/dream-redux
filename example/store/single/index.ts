import { StoreCreator } from '../../../src/index'
import { config } from './config'

export const {
  store,
  persistor,
  useSelector,
  setReducer,
  commitMutation,
} = new StoreCreator(config)
