import { ICounterState, ITodoState, IStoreState } from './state'

const counter = 'counter'
const todo = 'todo'

export const changeCounter = (isAdd: boolean) => {
  return {
    type: 'CHANGE_COUNTER',
    target: counter,
    operation: (state: ICounterState) => {
      if (isAdd) {
        state.count++
      } else if (state.count > 0) {
        state.count--
      }
    },
  }
}

export const createTodoItem = (value: string) => {
  return {
    type: 'CREATE_TODO_ITEM',
    target: [counter, todo],
    operation: [
      (state: ICounterState) => {
        state.count++
      },
      (state: ITodoState) => {
        state.list.push(value)
      },
    ],
  }
}

export const createTodoItemAsync = (value: string) => {
  const mutation = {
    type: 'CREATE_TODO_ITEM_ASYNC',
    target: [counter, todo],
    operation: [
      (state: ICounterState) => {
        state.count++
      },
      (state: ITodoState) => {
        state.list.push(value)
      },
    ],
  }
  return dispatch => {
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch(mutation)
        resolve()
      }, 2000)
    })
  }
}

const _fakeHttpRequest = (): Promise<{ data: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: '这是通过请求获取的数据',
      })
    }, 1000)
  })
}

export const createTodoItemByFetch = () => {
  return (dispatch, getData: () => IStoreState) => {
    _fakeHttpRequest().then(res => {
      const { count } = getData().counter
      const mutation = {
        type: 'CREATE_TODO_ITEM_BY_FETCH',
        target: [counter, todo],
        operation: [
          (state: ICounterState) => {
            state.count++
          },
          (state: ITodoState) => {
            state.list.push(res.data + `_[${count}]`)
          },
        ],
      }
      dispatch(mutation)
    })
  }
}

export const deleteTodoItem = (index: number) => {
  return {
    type: 'CREATE_TODO_ITEM',
    target: todo,
    operation: (state: ITodoState) => {
      state.list.splice(index, 1)
    },
  }
}
