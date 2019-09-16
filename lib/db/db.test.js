const {
  Create,
  Get,
  Scan,
  Query,
  Update,
  Delete
} = require('./db')

const DOC1 = { id: '1', version: 'v0' }
const DOC2 = { id: '2', version: 'v0' }

it('can create', async () => {
  await Create(DOC1)
  await Create(DOC2)
})

it('can get', async () => {
  const data = await Get(DOC1)

  expect(data).toEqual(DOC1)
})

it('can scan', async () => {
  const data = await Scan()
  expect(data.items.length).toBe(2)
  expect(data.items[0].id).toBe(DOC1.id)
  expect(data.items[0].version).toBe(DOC1.version)
  expect(data.next).toBe(null)
})

// it('can query', async () => {
//   const data = await Query({
//     id: DOC1.id
//   }, {
//     version: 'V0'
//   })
//   expect(data.items.length).toBe(1)
//   expect(data.next).toBe(null)
// })

// it('can update', async () => {
//   const data = await Update(DOC1, {
//     version: 'V1'
//   })
//   expect(data.version).toBe('V1')
// })

it('can delete', async () => {
  const data = await Delete(DOC1)
  expect(data).toStrictEqual(DOC1)
})
