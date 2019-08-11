const { gql } = require('apollo-server-express')

const schema = gql`
type URL {
  id: String
  url: String
  owner: User
  latest: Int
  varies: String
  createdAt: String
  updatedAt: String
}

type User {
  id: String
  avatar: String
  urls: [URL]
}

type Auth {
  token: String
}

type Urls {
  items: [URL]
  count: Int
  lastKey: String
}

type Query {
  login(token: String!): Auth
  getMyUrls(limit: Int, lastKey: String): Urls
  getUrlVersions(id: ID!, limit: Int, lastKey: String): Urls
  getUrlbyId(id: ID!): URL
}

type Mutation {
  updateUrl(id: ID!, url: String!): URL
  addUrl(url: String!) : URL
}
`

module.exports = schema
