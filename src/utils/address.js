const {createHash} = require('crypto')

const TP_NAME = 'xo'
const PREFIX_LENGTH = 6
const NAME_LENGTH = 64

const getStringHash = (string) => createHash('sha512').update(string).digest('hex')
const getAddressPart = (string, length) => getStringHash(string).substring(0, length)
const getAddress = (gameName) => getAddressPart(TP_NAME, PREFIX_LENGTH) + getAddressPart(gameName, NAME_LENGTH)

const utils = {
  getStringHash,
  getAddressPart,
  getAddress,
}

module.exports = utils