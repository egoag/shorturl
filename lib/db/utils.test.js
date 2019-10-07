const { validate, transform } = require('./utils')

it('validate', () => {
  const vld = validate({
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  })
  expect(() => {
    vld({})
  }).toThrow('should have required property \'id\'')
})

it('transform', () => {
  const tf = transform({ id: 'email' })
  const obj = tf({ id: 'root@localhost' })
  expect(obj).toStrictEqual({ email: 'root@localhost' })
})
