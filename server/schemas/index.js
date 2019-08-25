const { gql } = require('apollo-server-express')

const schema = gql`
type URL {
  id: String
  url: String
  owner: User
  latest: Int
  varies: String
  versions: Urls
  createdAt: String
  updatedAt: String
}

type User {
  id: String
  name: String
  avatar: String
  urls: Urls
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
  getOauthUrl: String
  login(token: String!): Auth
  getMyUrls(limit: Int, lastKey: String): Urls
  getUrlbyId(id: ID!): URL
}

type Mutation {
  addUrl(url: String!) : URL
  updateUrl(id: ID!, url: String!): URL
  deleteUrl(id: ID!): Boolean
}
`
module.exports = schema