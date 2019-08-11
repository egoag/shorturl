const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const config = require('../config')

const authMiddleware = expressJwt({
  secret: config.Server.Secret,
  credentialsRequired: false
})

const sign = payload => jwt.sign(payload, config.Server.Secret, { expiresIn: '24h' })

module.exports = {
  sign,
  authMiddleware
}
