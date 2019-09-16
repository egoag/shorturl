const _ = require('lodash')
const base = require('./base.json')
const test = require('./test.json')
const production = require('./production.json')
const development = require('./development.json')

const loadEnv = (obj, prefix = 'CONFIG') => {
  for (const [key, val] of Object.entries(obj)) {
    switch (typeof val) {
      case 'object': {
        // Object or Array
        if (val) {
          if (val.constructor === Array) {
            console.error('not support array, keep it as it is.')
          } else {
            obj[key] = loadEnv(val, `${prefix}_${key}`)
          }
        }
        break
      }
      case 'boolean': {
        const ENV_NAME = `${prefix.toUpperCase()}_${key.toUpperCase()}`
        if (ENV_NAME in process.env) {
          obj[key] = Boolean((process.env[ENV_NAME] || '').match(/^true$/))
        }
        break
      }
      case 'string': {
        const ENV_NAME = `${prefix.toUpperCase()}_${key.toUpperCase()}`
        if (ENV_NAME in process.env) {
          obj[key] = process.env[ENV_NAME]
        }
        break
      }
      case 'number': {
        const ENV_NAME = `${prefix.toUpperCase()}_${key.toUpperCase()}`
        if (ENV_NAME in process.env) {
          obj[key] = Number(process.env[ENV_NAME])
        }
        break
      }
    }
  }
  return obj
}

const isTest = Boolean(process.env.JEST_WORKER_ID)
const isProduction = Boolean((process.env.NODE_ENV || '').match(/^(prod|production)$/))
const isDevelopment = !isProduction

const Config = loadEnv(isTest ? _.merge(base, test) : isDevelopment ? _.merge(base, development) : _.merge(base, production))

module.exports = Config
