const urls = require('./urls')
const users = require('./users')

const resolvers = {
  URL: {
    owner: urls.getUser
  },
  User: {
    urls: users.getUrls
  },
  Query: {
    login: users.login,
    getUrlbyId: urls.getUrlById,
    getMyUrls: urls.getMyUrls,
    getUrlVersions: urls.getUrlVersions
  },
  Mutation: {
    addUrl: urls.addUrl,
    updateUrl: urls.updateUrl
  }
}

module.exports = resolvers
