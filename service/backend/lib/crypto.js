const crypto = require('crypto')
const dotenv = require('dotenv')

dotenv.config()

const {CRYPTO_SECRET} = process.env

module.exports.encrypt = text => {
  const cipher = crypto.createCipher('aes-256-cbc', CRYPTO_SECRET)
  const result = cipher.update(text, 'utf8', 'base64')
  return result + cipher.final('base64')
}

module.exports.decrypt = text => {
  const decipher = crypto.createDecipher('aes-256-cbc', CRYPTO_SECRET)
  const result = decipher.update(text, 'base64', 'utf8')
  return result + decipher.final('utf8')
}
