const _ = require('lodash')
const base = require('./config.base.json')
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

const isTest = Boolean(process.env.JEST_WORKER_ID)
const isProduction = Boolean((process.env.NODE_ENV || '').match(/^(prod|production)$/))
const isDevelopment = !isProduction

let Config = loadEnv(isProduction ? _.merge(base, production) : _.merge(base, development))
Config = { ...Config, isProduction, isDevelopment, isTest }

module.exports = Config
