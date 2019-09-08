const Url = require('./url')

const URL = 'https://localhost'
const NEW_URL = 'https://example.com'
const URL_ID = randomId()

it('Create url', async () => {
  const url = new Url({ urlId: URL_ID, url: URL })
  await url.create()
})

it('List url', async () => {
  const urls = await Url.list({})
  expect(urls.items, 'No items')
  assert(urls.items.length > 0, 'No items')
})

it('Get url', async () => {})

it('Update url\'s url', async () => {})

it('Get all version urls', async () => {})

it('Delete url', async () => {})
