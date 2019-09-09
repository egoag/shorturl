const { ApolloServer } = require.main === module ? require('apollo-server') : require('apollo-server-lambda')

const schema = require('./schemas')
const resolvers = require('./resolvers')
const { auth } = require('./lib/auth')

const server = new ApolloServer({
  resolvers,
  typeDefs: schema,
  context: auth
})

if (require.main === module) {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
} else {
  exports.handler = server.createHandler()
}
