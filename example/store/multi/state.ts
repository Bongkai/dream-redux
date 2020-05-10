export interface IStoreState {
  counter: ICounterState
  todo: ITodoState
}

export interface ICounterState {
  count: number
}

export interface ITodoState {
  list: string[]
}

// store.getState().counter
export const counterState: ICounterState = {
  count: 0,
}

// store.getState().todo
export const todoState: ITodoState = {
  list: [],
}
