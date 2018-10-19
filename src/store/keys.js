import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'

import apiUtils from '../utils/api'
import snackbar from './snackbar'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

import keyUtils from '../utils/key'

const state = {
  player1: null,
  player2: null,
}

const actions = {
  loadKeys: () => ({
    type: 'KEYS_LOAD',
  }),
  createKey: (player, displayConfirmation) => ({
    type: 'KEYS_CREATE',
    player,
    displayConfirmation,
  }),
  setKey: (player, key) => ({
    type: 'KEYS_SET',
    player,
    key,
  }),
}

const mutations = {
  KEYS_SET: (state, action) => {
    state[`player${action.player}`] = action.key
  },
}

const sagas = createSagas(sagaErrorWrapper({
  KEYS_LOAD: function* (action) {
    const player1Key = keyUtils.load(1)
    const player2Key = keyUtils.load(2)

    if(player1Key) {
      yield put(actions.setKey(1, player1Key))  
    }
    else {
      yield put(actions.createKey(1))
    }

    if(player2Key) {
      yield put(actions.setKey(2, player2Key))  
    }
    else {
      yield put(actions.createKey(2))
    }
  },
  KEYS_CREATE: function* (action) {
    const newPrivateKey = keyUtils.create()
    keyUtils.save(action.player, newPrivateKey.asHex())
    yield put(actions.setKey(action.player, newPrivateKey.asHex()))
    if(action.displayConfirmation) {
      yield put(snackbar.actions.setMessage(`Keys for player${ action.player } regenerated...`))
    }
  }
}))

const module = {
  name : 'keys',
  state, 
  actions, 
  mutations,
  sagas,
}

export default module