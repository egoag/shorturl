const Url = require('../models/url')
const User = require('../models/user')
const debug = require('debug')('debug:resolver:urls')

/* User */
const getUser = async (url) => {
  try {
    const user = await User.getById(url.ownerId)
    return user
  } catch (e) {
    debug(e)
    return null
  }
}

/* Query */
const getUrlById = async (_, { id }) => {
  const url = await Url.getById({ id })
  return url
}

const getMyUrls = async (_, { limit, lastKey: lastKeyString }, context) => {
  const ownerId = context.user.email
  if (!ownerId) {
    throw new Error('Unauthorized')
  }

  let lastKey
  if (lastKey) {
    try {
      lastKey = JSON.parse(lastKeyString)
    } catch (e) {
      throw new Error('Invalid lastKey')
    }
  }

  const urls = await User.getUrlsByOwnerId({ ownerId, limit, lastKey })
  debug(urls)
  return urls
}

const getUrlVersions = async (_, { id, limit, lastKey: lastKeyString }, context) => {
  const ownerId = context.user.email
  if (!ownerId) {
    throw new Error('Unauthorized')
  }

  let lastKey
  if (lastKey) {
    try {
      lastKey = JSON.parse(lastKeyString)
    } catch (e) {
      throw new Error('Invalid lastKey')
    }
  }

  const urls = await Url.getByIdAllVersion({ id, lastKey, limit })
  return urls
}

/* Mutation */
const addUrl = async (_, { url }, context) => {
  const obj = new Url({ url, ownerId: context.user.email })
  await obj.create()
  return obj
}

const updateUrl = async (_, { id, url }, context) => {
  if (!context.user.email) {
    throw new Error('Unauthorized')
  }

  let obj
  try {
    obj = await Url.getById({ id })
  } catch (e) {
    // todo: check not found
    throw new Error('Not found')
  }

  await obj.updateUrl(url)
  return obj
}

module.exports = {
  getUser,
  getUrlById,
  getMyUrls,
  getUrlVersions,
  addUrl,
  updateUrl
}
