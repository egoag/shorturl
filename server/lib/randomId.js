const crypto = require('crypto')
const baseX = require('base-x')

const BYTE_LEN = 6
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
const base64 = baseX(BASE64)

module.exports = () => base64.encode(crypto.randomBytes(BYTE_LEN))
