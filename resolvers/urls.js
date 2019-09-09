const { AuthenticationError } = require('apollo-server-express')

const Url = require('../models/url')
const User = require('../models/user')

/* User */
const getUser = async (url) => {
  if (!url.ownerId) return null
  const user = await User.getById(url.ownerId)
  return user
}

/* Query */
const getUrlById = async (_, { id }) => {
  const url = await Url.getById({ id })
  return url
}

const getMyUrls = async (_, { limit, lastKey: lastKeyString }, context) => {
  const ownerId = context.user.email
  if (!ownerId) {
    throw new AuthenticationError('Unauthorized')
  }

  let lastKey
  if (lastKeyString) {
    try {
      lastKey = JSON.parse(lastKeyString)
    } catch (e) {
      throw new Error('Invalid lastKey')
    }
  }

  const urls = await User.getUrlsByOwnerId({ ownerId, limit, lastKey })
  return urls
}

const getUrlVersions = async (url, { id, limit, lastKey: lastKeyString }, context) => {
  const ownerId = context.user.email
  if (!ownerId) {
    throw new AuthenticationError('Unauthorized')
  }

  let lastKey
  if (lastKeyString) {
    try {
      lastKey = JSON.parse(lastKeyString)
    } catch (e) {
      throw new Error('Invalid lastKey')
    }
  }

  const urls = await Url.getByIdAllVersion({ id: url ? url.id : id, lastKey, limit })
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
    throw new AuthenticationError('Unauthorized')
  }

  const obj = await Url.getById({ id })
  if (obj === null) {
    throw new Error('Not found')
  }

  await obj.updateUrl(url)
  return obj
}

const deleteUrl = async (_, { id }, context) => {
  if (!context.user.email) {
    throw new AuthenticationError('Unauthorized')
  }

  const obj = await Url.getById({ id })
  if (obj === null) {
    throw new Error('Not found')
  }

  await obj.delete()
  return true
}

module.exports = {
  getUser,
  getUrlById,
  getMyUrls,
  getUrlVersions,
  addUrl,
  updateUrl,
  deleteUrl
}
