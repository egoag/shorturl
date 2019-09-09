const ms = require('ms')
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')

const { Server: { Secret, Expiration } } = require('../config')

const auth = ({ req }) => {
  let user = {}
  if (req.headers && req.headers.authorization) {
    const [scheme, token] = req.headers.authorization.split(' ')
    if (scheme === 'Bearer') {
      try {
        user = jwt.verify(token, Secret, {})
      } catch (err) {
        throw new AuthenticationError('Invalid token')
      }
    } else {
      throw new AuthenticationError('Authorization format is Authorization: Bearer [token]')
    }
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
