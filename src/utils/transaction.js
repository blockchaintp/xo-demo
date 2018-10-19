const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')
const cbor = require('cbor')
const {createHash} = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')

const TP_NAME = 'xo'
const PREFIX_LENGTH = 6
const NAME_LENGTH = 64

const getStringHash = (string) => createHash('sha512').update(string).digest('hex')
const getAddressPart = (string, length) => getStringHash(string).substring(0, length)

const getAddress = (gameName) => getAddressPart(TP_NAME, PREFIX_LENGTH) + getAddressPart(gameName, NAME_LENGTH)

const createTransaction = (opts) => {

  const {
    privateKey,
    payload,
  }

  const context = createContext('secp256k1')
  const privateKey = context.newRandomPrivateKey()
  const signer = new CryptoFactory(context).newSigner(privateKey)

  const payload = {
    Verb: 'set',
    Name: 'foo',
    Value: 42
  }

  const payloadBytes = cbor.encode(payload)

  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'intkey',
    familyVersion: '1.0',
    inputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    outputs: ['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
  }).finish()

  const signature = signer.sign(transactionHeaderBytes)

  const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes
  })

  console.log(transactionHeaderBytes)
}