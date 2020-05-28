import { ICounterState, ITodoState, IStoreState } from './state'

const counter = 'counter'
const todo = 'todo'

export const changeCounter = (isAdd: boolean) => ({
  type: 'CHANGE_COUNTER',
  target: counter,
  operation: (state: ICounterState) => {
    if (isAdd) {
      state.count++
    } else if (state.count > 0) {
      state.count--
    }
  },
})

export const createTodoItem = (value: string) => ({
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
})

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

// const _fakeHttpRequest_fail = (): Promise<any> => {
//   return Promise.reject()
// }

export const createTodoItemByFetch = () => {
  return (dispatch, getState: () => IStoreState) => {
    _fakeHttpRequest().then(res => {
      const { count } = getState().counter
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

export const deleteTodoItem = (index: number) => ({
  type: 'CREATE_TODO_ITEM',
  target: todo,
  operation: (state: ITodoState) => {
    state.list.splice(index, 1)
  },
})

export const fetchHttpRequest = () => ({
  type: 'FETCH_HTTP_REQUEST',
  target: todo,
  promise: _fakeHttpRequest(),
  pending: {
    operation: (state: ITodoState) => {
      console.log('Requesting...')
    },
  },
  success: {
    target: [counter, todo], // 各个阶段中可以设定 target 覆盖默认值
    operation: [
      (state: ICounterState, res: any) => {
        state.count++
      },
      (state: ITodoState, res: any) => {
        state.list.push(res.data)
      },
    ],
  },
  fail: {
    target: todo,
    operation: (state: ITodoState, err: any) => {
      console.log(err)
    },
  },
})
