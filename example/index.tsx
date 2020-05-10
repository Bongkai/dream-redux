import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '../src/index'

// import { store } from './store/single'
// import SingleReducerExample from './SingleReducerExample'

import { store } from './store/multi'
import MultiReducersExample from './MultiReducersExample'

ReactDOM.render(
  <Provider store={store}>
    {/* <SingleReducerExample /> */}
    <MultiReducersExample />
  </Provider>,
  document.getElementById('root'),
)
