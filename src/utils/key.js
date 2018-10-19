const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const context = createContext('secp256k1')

const load = (player) => window.localStorage.getItem(`key${player}`)
const save = (player, value) => window.localStorage.setItem(`key${player}`, value)

const create = () => context.newRandomPrivateKey()
const privateKeyFromHex = (privateKeyHex) => Secp256k1PrivateKey.fromHex(privateKeyHex)
const publicKeyFromPrivateKey = (privateKey) => context.getPublicKey(privateKey)

const utils = {
  load,
  save,
  create,
  privateKeyFromHex,
  publicKeyFromPrivateKey,
}

export default utils