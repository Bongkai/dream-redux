import { state } from './state'
import { StoreConfig } from '../../../src/types'

export const config: StoreConfig = {
  reducer: {
    name: 'root',
    initialState: state,
  },
}
