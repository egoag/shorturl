const urls = require('./urls')
const users = require('./users')
const { getEndpoint } = require('../lib/oauth')

const resolvers = {
  URL: {
    owner: urls.getUser,
    versions: urls.getUrlVersions
  },
  User: {
    urls: users.getUrls
  },
  Query: {
    getOauthUrl: getEndpoint,
    login: users.login,
    getMyUrls: urls.getMyUrls,
    getUrlbyId: urls.getUrlById
  },
  Mutation: {
    addUrl: urls.addUrl,
    updateUrl: urls.updateUrl,
    deleteUrl: urls.deleteUrl
  }
}

module.exports = resolvers
