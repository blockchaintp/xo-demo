const axios = require('axios')
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')
const cbor = require('cbor')
const {createHash} = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')

const context = createContext('secp256k1')
const addressUtils = require('./src/utils/address')
const keyUtils = require('./src/utils/key')
const transactionUtils = require('./src/utils/transaction')

const url = (path = '') => `http://localhost:8008/${path || ''}`

const privateKey = keyUtils.create()

const gameName = 'newgame'
const payload = [gameName,'create',''].join(',')

const batchBytes = transactionUtils.singleTransactionBytes({
  privateKeyHex: privateKey.asHex(),
  gameName: gameName,
  payload,
})

axios({
  method: 'post',
  url: url(`batches`), 
  data: batchBytes,
  headers: {'Content-Type': 'application/octet-stream'},
})
  .then(result => {
    console.log('-------------------------------------------');
    console.log('result')
    console.log(result)
  })
  .catch(e => {
    console.log('-------------------------------------------');
    console.log(e.toString())
  })