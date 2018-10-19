import { createSagas } from 'redux-box'

import apiUtils from '../utils/api'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

const state = {
  message: '',
  isOpen: false,
}

const actions = {
  setMessage: (message) => ({
    type: 'SNACKBAR_MESSAGE',
    message,
  }),
  setError: (message) => ({
    type: 'SNACKBAR_MESSAGE',
    message,
    error: true,
  }),
  close: () => ({
    type: 'SNACKBAR_CLOSE',
  })
}

const mutations = {
  SNACKBAR_MESSAGE: (state, action) => {
    state.isOpen = true
    state.message = apiUtils.getError(action.message)
    if(action.error) {
      console.error(`[ERROR] ${state.message}`)
    }
  },
  SNACKBAR_CLOSE: (state, action) => {
    state.isOpen = false
  },
}

const sagas = createSagas(sagaErrorWrapper({
  
}))

const module = {
  name : 'error',
  state, 
  actions, 
  mutations,
  sagas,
}

export default module