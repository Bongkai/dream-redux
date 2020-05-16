import { StoreCreator } from '../../../es/dream-redux'
import { config } from './config'
import { IStoreState, ICounterState, ITodoState } from './state'

export const {
  store,
  persistor,
  useSelector,
  setReducer,
  commitMutation,
} = new StoreCreator(config)

export function useCounterSelector() {
  return useSelector<IStoreState, ICounterState>(state => state.counter)
}

export function useTodoSelector() {
  return useSelector<IStoreState, ITodoState>(state => state.todo)
}
