const production = require('./config.production.json')
const development = require('./config.development.json')

const loadEnv = (obj, prefix = 'CONFIG') => {
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'object') {
      // Object or Array
      if (val.constructor === Array) {
        console.error('not support array, keep it as it is.')
      } else {
        obj[key] = loadEnv(val, `${prefix}_${key}`)
      }
    } else {
      // Number or String
      const ENV_NAME = `${prefix.toUpperCase()}_${key.toUpperCase()}`
      if (ENV_NAME in process.env) {
        obj[key] = process.env[ENV_NAME]
      }
    }
  }
  return obj
}

const Config = loadEnv((process.env.NODE_ENV || '').match(/^(prod|production)$/) ? production : development)

module.exports = Config
