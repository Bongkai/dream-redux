import React, { useState } from 'react'
import {
  useCounterSelector,
  useTodoSelector,
  commitMutation,
} from './store/multi'
import {
  changeCounter,
  createTodoItem,
  createTodoItemAsync,
  // createTodoItemByFetch,
  deleteTodoItem,
  fetchHttpRequest,
} from './store/multi/mutations'

export default function MultiReducerExample() {
  const [inputValue, setInputValue] = useState('')
  const { count } = useCounterSelector()
  const { list } = useTodoSelector()

  function onCounterChange(isAdd: boolean) {
    commitMutation(changeCounter(isAdd))
    console.log('dispatch_middle')
    commitMutation(changeCounter(isAdd))
    console.log('dispatch_after')
  }

  function createTodo() {
    if (inputValue) {
      commitMutation(createTodoItem(inputValue))
      setInputValue('')
    }
  }

  async function createTodoAsync() {
    if (inputValue) {
      // commitMutation(createTodoItemAsync(inputValue))
      const state = await commitMutation(
        [changeCounter(true), createTodoItemAsync(inputValue)],
        true,
      )
      console.log('createTodoAsync_state', state)
      setInputValue('')
    }
  }

  function createTodoByFetch() {
    // commitMutation(createTodoItemByFetch())
    commitMutation(fetchHttpRequest())
  }

  function onItemDelete(index: number) {
    commitMutation(deleteTodoItem(index))
  }

  const styles = { display: 'flex', marginBottom: '10px' }

  return (
    <div>
      <div style={styles}>
        <button disabled={count <= 0} onClick={() => onCounterChange(false)}>
          -
        </button>
        <div style={{ margin: '0 10px' }}>{count}</div>
        <button onClick={() => onCounterChange(true)}>+</button>
      </div>
      <div style={styles}>
        <input
          value={inputValue}
          onChange={ev => setInputValue(ev.target.value)}
        />
        <button disabled={!inputValue} onClick={createTodo}>
          添加
        </button>
        <button disabled={!inputValue} onClick={createTodoAsync}>
          2秒后添加
        </button>
        <button onClick={createTodoByFetch}>发送请求获取数据</button>
      </div>
      {list.map((item, index) => (
        <div key={index} style={styles}>
          <li style={{ marginRight: '10px' }}>{item}</li>
          <button onClick={() => onItemDelete(index)}>删除</button>
        </div>
      ))}
    </div>
  )
}
