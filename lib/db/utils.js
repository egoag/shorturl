const Ajv = require('ajv')
const lodash = require('lodash')
const { ValidationError, TransformError } = require('./errors')

/**
 * validate factory
 *
 * @static
 * @param {Object} schema JSON Schema object
 * @returns {Function} validate function
 */
const validate = (schema) => {
  return (obj) => {
    const ajv = new Ajv()
    if (!ajv.validate(schema, obj)) {
      throw new ValidationError(ajv.errors)
    }
    return obj
  }
}

/**
 * transform object factory
 *
 * @static
 * @param {Object} mapping single depth object to transform keys
 * @returns {Function} tranform function
 */
const transform = (mapping) => {
  function tranform_ (obj) {
    const newObj = lodash.mapKeys(obj, (_, key) => {
      const newKey = mapping[key]
      if (newKey) {
        const newKeyType = typeof newKey
        if (newKeyType !== 'string') {
          throw new TransformError(`invalid type: ${newKeyType}`)
        }
        return newKey
      } else {
        return key
      }
    })
    return newObj
  }

  return tranform_
}

module.exports = {
  validate,
  transform
}
