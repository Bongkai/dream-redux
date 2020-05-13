import { counterState, todoState } from './state'
import { StoreConfig } from '../../../src/types'

export const config: StoreConfig = {
  reducerConfig: [
    {
      name: 'counter',
      initialState: counterState,
      // persist: {},
    },
    {
      name: 'todo',
      initialState: todoState,
      // persist: {},
    },
  ],
}
