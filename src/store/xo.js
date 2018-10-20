import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { initialize, getFormValues } from 'redux-form'

import apiUtils from '../utils/api'
import snackbar from './snackbar'
import sagaErrorWrapper from '../utils/sagaErrorWrapper'

import xoApi from '../api/xo'
import gameUtils from '../utils/game'
import keyUtils from '../utils/key'
import addressUtils from '../utils/address'
import transactionUtils from '../utils/transaction'

const state = {
  games: [],
  currentGame: null,
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
  }),
  deleteGame: (name) => ({
    type: 'GAMES_DELETE_GAME',
    name,
  }),
  viewGame: (name) => ({
    type: 'PAGE_VIEW_GAME',
    payload: {
      name
    },
  }),
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
    const games = yield select(state => state.xo.games)
    const gameName = formValues.name
    const nameExists = games.filter(game => game.name == gameName).length > 0
    if(nameExists) {
      yield put(actions.setNewGameError(`There is aleady a game called ${gameName}`))
      return
    }
    yield put(actions.setNewGameError(''))

    const payload = [gameName,'create',''].join(',')

    const privateKey = keyUtils.create()

    const transactionBytes = transactionUtils.singleTransactionBytes({
      privateKeyHex: privateKey.asHex(),
      gameName,
      payload,
    })

    try {
      const response = yield call(xoApi.submitTransaction, transactionBytes)
      yield put(actions.setNewGameWindowOpen(false))
      yield put(snackbar.actions.setMessage(`game: ${gameName} created`))
      yield put(actions.viewGame(gameName))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(actions.setNewGameError(e.toString()))
      yield put(snackbar.actions.setError(e.toString()))
    }
    
  },

  GAMES_DELETE_GAME: function* (action) {
    const gameName = action.name
    const payload = [gameName,'delete',''].join(',')

    const privateKey = keyUtils.create()

    const transactionBytes = transactionUtils.singleTransactionBytes({
      privateKeyHex: privateKey.asHex(),
      gameName,
      payload,
    })

    try {
      const response = yield call(xoApi.submitTransaction, transactionBytes)
      yield put(snackbar.actions.setMessage(`game: ${gameName} deleted`))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(snackbar.actions.setError(e.toString()))
    }
  },
}))

const module = {
  name : 'xo',
  state, 
  actions, 
  mutations,
  sagas,
}

export default module