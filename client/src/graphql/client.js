import ApolloClient from 'apollo-boost'
import resolvers from './resolvers'
import { cache, data } from './cache'
import { AuthHeaders } from '../lib/auth'

const SERVER = 'https://api.shorturl.henshin.me/graphql'

const client = new ApolloClient({
  uri: SERVER,
  cache,
  resolvers,
  connectToDevTools: true,
  request: async operation => {
    const authHeaders = AuthHeaders()
    operation.setContext({
      headers: {
        ...authHeaders
      }
    })
  }
})

client.onResetStore(() => cache.writeData(data))

export default client
