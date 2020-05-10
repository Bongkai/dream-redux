import { IRootState } from './state'

const target = 'root'

export const decreaseCounter = () => {
  return {
    type: 'DECREASE_COUNTER',
    target,
    operation: (state: IRootState) => {
      state.count--
    },
  }
}

export const updateInput = value => {
  return {
    type: 'UPDATE_INPUT',
    target,
    operation: (state: IRootState) => {
      state.input = value
    },
  }
}
