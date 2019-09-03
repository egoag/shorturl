import { InMemoryCache } from 'apollo-boost'

const data = {
  visiableUrls: []
}

const cache = new InMemoryCache()

cache.writeData({ data })

export {
  data,
  cache
}
