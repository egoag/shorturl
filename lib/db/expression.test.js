const { UPDATES, CONDITIONS, toUpdateExpression, toConditionExpression } = require('./expression')

const ID = 'FFFFFFFF'
const AGE1 = 18
const AGE2 = 28
const AGE3 = 38
const URL = 'http://example.com'

it('condition and', () => {
  const condition = {
    $and: [
      { id: ID },
      { url: URL }
    ]
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#id': 'id', '#url': 'url' })
  expect(values).toStrictEqual({ ':id_0': ID, ':url_0': URL })
  expect(expression).toBe('(#id = :id_0) AND (#url = :url_0)')
})

it('condition and simple', () => {
  const condition = {
    id: ID,
    url: URL
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#id': 'id', '#url': 'url' })
  expect(values).toStrictEqual({ ':id_0': ID, ':url_0': URL })
  expect(expression).toBe('(#id = :id_0) AND (#url = :url_0)')
})

it('condition or', () => {
  const condition = {
    $or: [
      { id: ID },
      { url: URL }
    ]
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#id': 'id', '#url': 'url' })
  expect(values).toStrictEqual({ ':id_0': ID, ':url_0': URL })
  expect(expression).toBe('(#id = :id_0) OR (#url = :url_0)')
})

it('condition not', () => {
  const condition = {
    $not: { id: ID }
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#id': 'id' })
  expect(values).toStrictEqual({ ':id_0': ID })
  expect(expression).toBe('NOT (#id = :id_0)')
})

it('condition eq', () => {
  const condition = {
    url: URL
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#url': 'url' })
  expect(values).toStrictEqual({ ':url_0': URL })
  expect(expression).toBe('#url = :url_0')
})

it('condition gt', () => {
  const condition = {
    age: CONDITIONS.GT(AGE1)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1 })
  expect(expression).toBe('#age > :age_0')
})

it('condition lt', () => {
  const condition = {
    age: CONDITIONS.LT(AGE1)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1 })
  expect(expression).toBe('#age < :age_0')
})

it('condition gte', () => {
  const condition = {
    age: CONDITIONS.GTE(AGE1)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1 })
  expect(expression).toBe('#age >= :age_0')
})

it('condition lte', () => {
  const condition = {
    age: CONDITIONS.LTE(AGE1)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1 })
  expect(expression).toBe('#age <= :age_0')
})

it('condition in', () => {
  const condition = {
    age: CONDITIONS.IN(AGE1, AGE2, AGE3)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1, ':age_1': AGE2, ':age_2': AGE3 })
  expect(expression).toBe('#age IN (:age_0, :age_1, :age_2)')
})

it('condition btw', () => {
  const condition = {
    age: CONDITIONS.BTW(AGE1, AGE3)
  }
  const { expression, names, values } = toConditionExpression(condition)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': AGE1, ':age_1': AGE3 })
  expect(expression).toBe('#age BETWEEN :age_0 AND :age_1')
})

it('update set', () => {
  const update = {
    url: URL
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#url': 'url' })
  expect(values).toStrictEqual({ ':url_0': URL })
  expect(expression).toBe('SET #url = :url_0')
})

it('update add', () => {
  const update = {
    age: UPDATES.ADD(1)
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': 1 })
  expect(expression).toBe('SET #age = #age + :age_0')
})

it('update sub', () => {
  const update = {
    age: UPDATES.SUB(1)
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#age': 'age' })
  expect(values).toStrictEqual({ ':age_0': 1 })
  expect(expression).toBe('SET #age = #age - :age_0')
})

it('update list set', () => {
  const update = {
    siblings: UPDATES.LIST_SET(0, 'Alice')
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': 0, ':siblings_1': 'Alice' })
  expect(expression).toBe('SET #siblings[:siblings_0] = :siblings_1')
})

it('update list push', () => {
  const update = {
    siblings: UPDATES.LIST_PUSH(['Alice', 'Bob'])
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': ['Alice', 'Bob'] })
  expect(expression).toBe('SET #siblings = list_append(#siblings, :siblings_0)')
})

it('update if not exists', () => {
  const update = {
    siblings: UPDATES.IF_NOT_EXISTS(['Alice', 'Bob'])
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': ['Alice', 'Bob'] })
  expect(expression).toBe('SET #siblings = if_not_exists(#siblings, :siblings_0)')
})

it('update remove', () => {
  const update = {
    siblings: UPDATES.REMOVE()
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({})
  expect(expression).toBe('REMOVE #siblings')
})

it('update remove list', () => {
  const update = {
    siblings: UPDATES.LIST_REMOVE(1)
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': 1 })
  expect(expression).toBe('REMOVE #siblings[:siblings_0]')
})

it('update remove list multiple elements', () => {
  const update = {
    siblings: UPDATES.LIST_REMOVE(0, 1)
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': 0, ':siblings_1': 1 })
  expect(expression).toBe('REMOVE #siblings[:siblings_0], #siblings[:siblings_1]')
})

it('update delete', () => {
  const update = {
    siblings: UPDATES.DELETE(['Alice', 'Bob'])
  }
  const { expression, names, values } = toUpdateExpression(update)
  expect(names).toStrictEqual({ '#siblings': 'siblings' })
  expect(values).toStrictEqual({ ':siblings_0': ['Alice', 'Bob'] })
  expect(expression).toBe('DELETE #siblings :siblings_0')
})
