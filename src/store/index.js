import { compose, applyMiddleware } from 'redux';
import { createStore } from 'redux-box'
import { reducer as formReducer }  from 'redux-form'
import { connectRoutes } from 'redux-first-router'
import createHistory from 'history/createBrowserHistory'

import { routes } from '../router'
import snackbarModule from './snackbar'
import xoModule from './xo'
import keysModule from './keys'
import validatorModule from './validator'

const history = createHistory()
const router = connectRoutes(history, routes) 

const modules = [  
  snackbarModule,
  xoModule,
  keysModule,
  validatorModule,
]

const config = {
  reducers : {
    form : formReducer,
    location: router.reducer,
  },
  middlewares: [router.middleware],
  composeRedux: (composer) => (middleware) => composer(router.enhancer, middleware),
}

export default createStore(modules, config)