import { StoreCreator } from '../../../es/dream-redux'
import { config } from './config'

export const {
  store,
  persistor,
  useSelector,
  setReducer,
  commitMutation,
} = new StoreCreator(config)
