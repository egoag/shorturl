import { InMemoryCache } from 'apollo-boost'

const data = {}

const cache = new InMemoryCache()

cache.writeData({ data })

export {
  data,
  cache
}
