import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import snackbar from './snackbar'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

import xoApi from '../api/xo'
import gameUtils from '../utils/game'
import addressUtils from '../utils/address'
import transactionUtils from '../utils/transaction'

const state = {
  games: [],
  newGameWindowOpen: false,
  newGameError: null,
}

const actions = {
  loadGames: () => ({
    type: 'GAMES_LOAD_GAMES',
  }),
  setGames: (games) => ({
    type: 'GAMES_SET_GAMES',
    games,
  }),
  resetNewGameForm: () => initialize('gameForm', {}),
  submitNewGameForm: () => ({
    type: 'GAMES_SUBMIT_NEW_GAME',
  }),
  setNewGameWindowOpen: (value) => ({
    type: 'GAMES_SET_NEW_GAME_WINDOW_OPEN',
    value,
  }),
  setNewGameError: (value) => ({
    type: 'GAMES_SET_NEW_GAME_ERROR',
    value,
  })
}

const mutations = {
  GAMES_SET_GAMES: (state, action) => {
    state.games = action.games
  },
  GAMES_SET_NEW_GAME_WINDOW_OPEN: (state, action) => {
    state.newGameWindowOpen = action.value
  },
  GAMES_SET_NEW_GAME_ERROR: (state, action) => {
    state.newGameError = action.value
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
  },
  GAMES_SUBMIT_NEW_GAME: function* (action) {
    const formValues = yield select(state => getFormValues('gameForm')(state))
    const player1Keys = yield select(state => state.keys.player1)
    const games = yield select(state => state.xo.games)
    const gameName = formValues.name
    const nameExists = games.filter(game => game.name == gameName).length > 0
    if(nameExists) {
      yield put(actions.setNewGameError(`There is aleady a game called ${gameName}`))
      return
    }
    yield put(actions.setNewGameError(''))

    const payload = [gameName,'create',''].join(',')

    const transactionBytes = transactionUtils.singleTransactionBytes({
      privateKeyHex: player1Keys.private,
      gameName,
      payload,
    })

    try {
      const response = yield call(xoApi.submitTransaction, transactionBytes)
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