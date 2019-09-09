const { ApolloServer } = require('apollo-server-express')

const schema = require('./schemas')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    return {
      user: req.user || {}
    }
  }
})

module.exports = server
