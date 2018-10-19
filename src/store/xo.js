import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'

import apiUtils from '../utils/api'
import snackbar from './snackbar'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

import xoApi from '../api/xo'
import gameUtils from '../utils/game'

const state = {
  games: [],
}

const actions = {
  loadGames: () => ({
    type: 'GAMES_LOAD_GAMES',
  }),
  setGames: (games) => ({
    type: 'GAMES_SET_GAMES',
    games,
  })
}

const mutations = {
  GAMES_SET_GAMES: (state, action) => {
    state.games = action.games
  },
}

const sagas = createSagas(sagaErrorWrapper({
  GAMES_LOAD_GAMES: function* (action) {
    try {
      const response = yield call(xoApi.listGames)
      const games = (response.data.data || []).map(gameUtils.decode)
      yield put(actions.setGames(games))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield snackbar.actions.setError(e.toString())
    }
  }
}))

const module = {
  name : 'xo',
  state, 
  actions, 
  mutations,
  sagas,
}

export default module