import { createSagas } from 'redux-box'
import { call, put, select, fork, take, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
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
  currentPlayer: '1',
  currentGame: null,
  lastTransactionStatus: null,
  newGameWindowOpen: false,
  newGameError: null,
}

const actions = {
  loadGameListLoopStart: () => ({
    type: 'GAMES_LOAD_LIST_LOOP_START',
  }),
  loadGameListLoopStop: () => ({
    type: 'GAMES_LOAD_LIST_LOOP_STOP',
  }),
  loadGameLoopStart: (name) => ({
    type: 'GAMES_LOAD_GAME_LOOP_START',
    name,
  }),
  loadGameLoopStop: () => ({
    type: 'GAMES_LOAD_GAME_LOOP_STOP',
  }),
  loadBatchStatusLoop: (id) => ({
    type: 'GAMES_LOAD_BATCH_STATUS_LOOP',
    id,
  }),
  loadBatchStatusLoopStop: () => ({
    type: 'GAMES_LOAD_BATCH_STATUS_LOOP_STOP',
  }),
  setGames: (games) => ({
    type: 'GAMES_SET_GAMES',
    games,
  }),
  setCurrentGame: (game) => ({
    type: 'GAMES_SET_CURRENT_GAME',
    game,
  }),
  setLastTransactionStatus: (value) => ({
    type: 'GAMES_SET_LAST_TRANSACTION_STATUS',
    value,
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
  viewGames: () => ({
    type: 'PAGE_HOME',
  }),
  viewGame: (name) => ({
    type: 'PAGE_VIEW_GAME',
    payload: {
      name
    },
  }),
  makeMove: (index) => ({
    type: 'GAMES_MOVE',
    index,
  }),
  updateCurrentPlayer: (value) => ({
    type: 'GAMES_UPDATE_CURRENT_PLAYER',
    value,
  })
}

const mutations = {
  GAMES_SET_GAMES: (state, action) => {
    state.games = action.games
  },
  GAMES_SET_CURRENT_GAME: (state, action) => {
    state.currentGame = action.game
  },
  GAMES_SET_NEW_GAME_WINDOW_OPEN: (state, action) => {
    state.newGameWindowOpen = action.value
  },
  GAMES_SET_NEW_GAME_ERROR: (state, action) => {
    state.newGameError = action.value
  },
  GAMES_UPDATE_CURRENT_PLAYER: (state, action) => {
    state.currentPlayer = action.value
  },
  GAMES_SET_LAST_TRANSACTION_STATUS: (state, action) => {
    state.lastTransactionStatus = action.value
  },
}

function* loadGameListLoop() {
  while (true) {
    try {
      const response = yield call(xoApi.listGames)
      const games = (response.data.data || []).map(gameUtils.decode)
      yield put(actions.setGames(games))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(actions.loadGameListLoopStop())
    }
    yield call(delay, 1000)
  }
}

function* loadGameLoop(name) {
  while (true) {
    try {
      const response = yield call(xoApi.loadGame, name)
      const games = gameUtils.decode(response.data.data[0])
      yield put(actions.setCurrentGame(games))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(actions.loadGameLoopStop())
    }
    yield call(delay, 1000)
  }
}

function* loadBatchStatusLoop(id) {
  while (true) {
    try {
      const batchStatusResponse = yield call(xoApi.getBatchStatus, id)
      const batchStatusData = batchStatusResponse.data.data[0]

      if(batchStatusData.status != "PENDING") {
        const error = batchStatusData.status == "INVALID" ?
          batchStatusData.invalid_transactions[0].message :
          null

        if(batchStatusData.status == "INVALID") {
          yield put(snackbar.actions.setError('Transaction failed'))
        }
        else {
          yield put(snackbar.actions.setError('Transaction committed'))
        }

        yield put(actions.setLastTransactionStatus({
          id: batchStatusData.id,
          status: batchStatusData.status,
          error,
        }))
        yield put(actions.loadBatchStatusLoopStop())
      }
    } catch(e) {
      // we don't quit on errors because a 404 might mean the batch has not made it yet
    }

    yield call(delay, 1000)
    
  }
}

const sagas = createSagas(sagaErrorWrapper({
  GAMES_LOAD_LIST_LOOP_START: function* (action) {
    const loadGameListLoopTask = yield fork(loadGameListLoop)
    yield take(action => action.type == 'GAMES_LOAD_LIST_LOOP_STOP')
    yield cancel(loadGameListLoopTask)
  },
  GAMES_LOAD_GAME_LOOP_START: function* (action) {
    const loadGameLoopTask = yield fork(loadGameLoop, action.name)
    yield take(action => action.type == 'GAMES_LOAD_GAME_LOOP_STOP')
    yield cancel(loadGameLoopTask)
  },
  GAMES_LOAD_BATCH_STATUS_LOOP: function* (action) {
    const loadBatchStatusLoopTask = yield fork(loadBatchStatusLoop, action.id)
    yield take(action => action.type == 'GAMES_LOAD_BATCH_STATUS_LOOP_STOP')
    yield cancel(loadBatchStatusLoopTask)
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
      yield put(actions.resetNewGameForm())
      yield put(snackbar.actions.setMessage(`game: ${gameName} created`))
      //yield put(actions.viewGame(gameName))
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

  GAMES_MOVE: function* (action) {

    const moveIndex = action.index
    const currentGame = yield select(state => state.xo.currentGame)
    const currentPlayer = yield select(state => state.xo.currentPlayer)
    const player1LocalKeys = yield select(state => state.keys.player1)
    const player2LocalKeys = yield select(state => state.keys.player2)
    const gameName = currentGame.name

    const player1Keys = {
      local: player1LocalKeys.public,
      game: currentGame.player1Key,
    }

    const player2Keys = {
      local: player2LocalKeys.public,
      game: currentGame.player2Key,
    }

    const board = currentGame.board
    const moveCurrentCode = board.charAt(moveIndex)

    let privateKeyToUse = null

    // check the player can play
    if(currentPlayer == '1') {
      privateKeyToUse = player1LocalKeys.private
    }
    else if (currentPlayer == '2') {
      privateKeyToUse = player2LocalKeys.private
    }
  
    const payload = [gameName,'take',moveIndex+1].join(',')

    const transactionBytes = transactionUtils.singleTransactionBytes({
      privateKeyHex: privateKeyToUse,
      gameName,
      payload,
    })

    // cancel any rogue batch status loops
    yield put(actions.loadBatchStatusLoopStop())

    try {
      const response = yield call(xoApi.submitTransaction, transactionBytes)
      yield put(snackbar.actions.setMessage(`transaction submitted`))

      const JSONResponse = JSON.parse(response)

      const parts = JSONResponse.link.split('?id=')
      const id = parts[1]

      yield put(actions.loadBatchStatusLoop(id))
    } catch(e) {
      console.log('-------------------------------------------');
      console.error(e)
      yield put(snackbar.actions.setError(e.toString()))
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