import { state } from './state'
import { StoreConfig } from '../../../src/types'

export const config: StoreConfig = {
  reducerConfig: {
    name: 'root',
    initialState: state,
  },
}
