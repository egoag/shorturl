const ms = require('ms')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const { Server: { Secret, Expiration } } = require('../config')

const authMiddleware = expressJwt({
  secret: Secret,
  credentialsRequired: false
})

const sign = payload => ({
  token: jwt.sign(payload, Secret, { expiresIn: Expiration }),
  expiresIn: ms(Expiration)
})

module.exports = {
  sign,
  authMiddleware
}
