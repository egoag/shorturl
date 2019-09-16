const lodash = require('lodash')

class Operator {
  /**
   * Creates an instance of Operator.
   *
   * @param {Function} func
   * @param {string} type
   * @param {Array} params
   * @memberof Operator
   */
  constructor (type, func, params) {
    this.type = type
    this.func = func
    this.params = params
  }

  _nameToken () {
    return [...this.path, this.key].map(p => `#${p}`).join('.')
  }

  _valueTokens () {
    return this.params.map((_, i) => ':' + [...this.path, this.key, i].join('_'))
  }

  _names () {
    return { [this._nameToken()]: this.key }
  }

  _values () {
    const values = {}
    this._valueTokens().forEach((val, index) => {
      values[val] = this.params[index]
    })
    return values
  }

  _expression () {
    return this.func(this._nameToken(), ...this._valueTokens())
  }

  /**
   * generate final expression, names and values
   * @param {string} key current key
   * @param {Array} path parent path
   */
  run (key, path) {
    this.key = key
    this.path = path
    if (!key) {
      // only condition operators may have no key
      const { expressions, names, values } = this.params.reduce(({ expressions, names, values }, condition) => {
        const { expression, names: _names, values: _values } = toConditionExpression(condition)
        return {
          expressions: [...expressions, expression],
          names: lodash.merge(names, _names),
          values: lodash.merge(values, _values)
        }
      }, { expressions: [], names: {}, values: {} })
      const expression = this.func(...expressions)
      return [expression, names, values]
    } else {
      return [this._expression(), this._names(), this._values()]
    }
  }
}

const UPDATES = {
  SET: (operand) =>
    new Operator('SET', (a, b) => `${a} = ${b}`, [operand]),
  ADD: (operand) =>
    new Operator('SET', (a, b) => `${a} = ${a} + ${b}`, [operand]),
  SUB: (operand) =>
    new Operator('SET', (a, b) => `${a} = ${a} - ${b}`, [operand]),
  LIST_SET: (index, operand) =>
    new Operator('SET', (a, b, c) => `${a}[${b}] = ${c}`, [index, operand]),
  LIST_PUSH: (operand) =>
    new Operator('SET', (a, b) => `${a} = list_append(${a}, ${b})`, [operand]),
  IF_NOT_EXISTS: (operand) =>
    new Operator('SET', (a, b) => `${a} = if_not_exists(${a}, ${b})`, [operand]),
  REMOVE: () =>
    new Operator('REMOVE', (a) => `${a}`, []),
  LIST_REMOVE: (...index) =>
    new Operator('REMOVE', (a, ...b) => b.map(bb => `${a}[${bb}]`).join(', '), index),
  DELETE: (operand) =>
    new Operator('DELETE', (a, b) => `${a} ${b}`, [operand])
}

const CONDITIONS = {
  // - Logic
  AND: (...conditions) =>
    new Operator('AND', (...a) => a.map(aa => `(${aa})`).join(' AND '), conditions),
  OR: (...conditions) =>
    new Operator('OR', (...a) => a.map(aa => `(${aa})`).join(' OR '), conditions),
  NOT: (exp) =>
    new Operator('NOT', (a) => `NOT (${a})`, [exp]),
  // - Comparisions
  EQ: (val) =>
    new Operator('EQ', (a, b) => `${a} = ${b}`, [val]),
  GT: (val) =>
    new Operator('GT', (a, b) => `${a} > ${b}`, [val]),
  LT: (val) =>
    new Operator('LT', (a, b) => `${a} < ${b}`, [val]),
  GTE: (val) =>
    new Operator('GTE', (a, b) => `${a} >= ${b}`, [val]),
  LTE: (val) =>
    new Operator('LTE', (a, b) => `${a} <= ${b}`, [val]),
  IN: (...vals) =>
    new Operator('IN', (a, ...b) => `${a} IN (${b.join(', ')})`, vals),
  BTW: (min, max) =>
    new Operator('BTW', (a, b, c) => `${a} BETWEEN ${b} AND ${c}`, [min, max]),
  // - Functions
  SIZE: (path) =>
    new Operator('SIZE', (a) => `size(${a})`, path),
  EXISTS: (path) =>
    new Operator('EXISTS', (a) => `attribute_exists(${a})`, path),
  NOT_EXISTS: (path) =>
    new Operator('NOT_EXISTS', (a) => `attribute_not_exists(${a})`, path),
  CONTAINS: (path, operand) =>
    new Operator('CONTAINS', (a, b) => `contains(${a}, ${b})`, [path, operand]),
  IS_TYPE: (path, type) =>
    new Operator('IS_TYPE', (a, b) => `attribute_type(${a}, ${b})`, [path, type]),
  BEGINS_WITH: (path, substr) =>
    new Operator('BEGINS_WITH', (a, b) => `begins_with(${a}, ${b})`, [path, substr])
}

/**
 * Expression
 *
 * @typedef {Object} Expression
 * @property {String} expression
 * @property {Object} names
 * @property {Object} values
 */
/**
 * convert object to update expression
 *
 * @param {Object} update update expression object
 * @returns {Expression} expression, names and values.
 */
const toUpdateExpression = (update) => {
  const iter = (obj, path = []) => {
    let actions = {}
    let names = {}
    let values = {}

    const parser = (operator, key, path) => {
      const [_expression, _names, _values] = operator.run(key, path)
      if (!(operator.type in actions)) actions = { ...actions, [operator.type]: [] }
      actions[operator.type].push(_expression)
      names = lodash.merge(names, _names)
      values = lodash.merge(values, _values)
    }

    for (const [key, val] of Object.entries(obj)) {
      switch (val.constructor.name) {
        case 'Operator': {
          parser(val, key, path)
          break
        }
        case 'Number':
        case 'String':
        case 'Boolean':
        case 'Array': {
          const operator = UPDATES.SET(val)
          parser(operator, key, path)
          break
        }
        // nested operators
        case 'Object': {
          names[`#${key}`] = key
          const {
            actions: _actions,
            names: _names,
            values: _values
          } = iter(val, [...path, key])
          actions = lodash.merge(actions, _actions)
          names = lodash.merge(names, _names)
          values = lodash.merge(values, _values)
          break
        }
        default: {
          console.warn('ignore unknown type value:', val)
        }
      }
    }
    return { actions, names, values }
  }

  const { actions, names, values } = iter(update)
  const expression = Object.keys(actions).map(act =>
    `${act} ${actions[act].join(', ')}`
  ).join(' ')
  return { expression, names, values }
}

/**
 * convert object to condition expression
 *
 * @param {Object} condition condition expression object
 * @returns {Expression} expression, names and values.
 */
const toConditionExpression = (condition) => {
  const iter = (obj, path = []) => {
    let names = {}
    let values = {}
    let expression = ''

    const parser = (_expression, _names, _values) => {
      names = lodash.merge(names, _names)
      values = lodash.merge(values, _values)
      expression = _expression
    }

    // simplify $and operation
    let object
    if (Object.keys(obj).length > 1) {
      const conditions = Object.entries(obj).map(([key, value]) => ({ [key]: value }))
      object = { $and: conditions }
    } else {
      object = { ...obj } // deep copy?
    }

    // by now object should contains only one pair of key and value
    const [key, value] = Object.entries(object)[0]

    // if key is keywords($and, $or, $not)
    if (key.startsWith('$') && CONDITIONS[key.slice(1).toUpperCase()]) {
      // run value conditions and join them
      switch (key.slice(1).toUpperCase()) {
        case 'AND': {
          if (!Array.isArray(value)) {
            throw new Error('invalid value type, should be Array')
          }
          const operator = CONDITIONS.AND(...value)
          const [_expression, _names, _values] = operator.run(null, path)
          parser(_expression, _names, _values)
          break
        }
        case 'OR': {
          if (!Array.isArray(value)) {
            throw new Error('invalid value type, should be Array')
          }
          const operator = CONDITIONS.OR(...value)
          const [_expression, _names, _values] = operator.run(null, path)
          parser(_expression, _names, _values)
          break
        }
        case 'NOT': {
          if (!['Object', 'Operator'].includes(value.constructor.name)) {
            throw new Error('invalid value type, should be Object or Operator')
          }
          const operator = CONDITIONS.NOT(value)
          const [_expression, _names, _values] = operator.run(null, path)
          parser(_expression, _names, _values)
          break
        }
        default: {
          console.warn('ignore unknown logic name:', key)
        }
      }
    } else {
      // or run value condition
      switch (value.constructor.name) {
        case 'Operator': {
          const [_expression, _names, _values] = value.run(key, path)
          parser(_expression, _names, _values)
          break
        }
        case 'Number':
        case 'Boolean':
        case 'String':
        case 'Array': {
          const operator = CONDITIONS.EQ(value)
          const [_expression, _names, _values] = operator.run(key, path)
          parser(_expression, _names, _values)
          break
        }
        // nested conditions
        case 'Object': {
          const { expression, names, values } = iter(value, [...path, key])
          parser(expression, names, values)
          break
        }
        default: {
          console.warn('ignore unknown type value:', value)
        }
      }
    }

    return { expression, names, values }
  }

  const { expression, names, values } = iter(condition)
  return { expression, names, values }
}

module.exports = {
  UPDATES,
  CONDITIONS,
  toUpdateExpression,
  toConditionExpression
}
