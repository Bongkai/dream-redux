import React from 'react'
import { setReducer, useSelector, commitMutation } from './store/single'
import { IRootState } from './store/single/state'
import { decreaseCounter, updateInput } from './store/single/mutations'

export default function SingleReducerExample() {
  const { input, count } = useSelector<IRootState, IRootState>(state => state)

  function increase() {
    setReducer('root', state => {
      state.count++
    })
  }

  function decrease() {
    commitMutation(decreaseCounter())
  }

  function onInputChange(ev: any) {
    commitMutation(updateInput(ev.target.value))
  }

  return (
    <div>
      <input value={input} onChange={onInputChange} />
      <div style={{ display: 'flex' }}>
        <button onClick={decrease}>-</button>
        <div>{count}</div>
        <button onClick={increase}>+</button>
      </div>
    </div>
  )
}
