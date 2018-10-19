import { hot } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'
import Theme from './theme'
import Router from './router'

class Root extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <Theme>
          <Router />
        </Theme>
      </Provider>
    );
  }
}

export default hot(module)(Root)