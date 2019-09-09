const ms = require('ms')
const jwt = require('jsonwebtoken')

const { Server: { Secret, Expiration } } = require('../config')

const auth = ({ req }) => {
  let user = {}
  const token = req.headers.authorization
  if (token) {
    user = jwt.verify(token, Secret, {})
  }
  return { user }
}

const sign = payload => ({
  token: jwt.sign(payload, Secret, { expiresIn: Expiration }),
  expiresIn: ms(Expiration)
})

module.exports = {
  sign,
  auth
}
