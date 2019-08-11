const debug = require('debug')('debug:resolver:users')
const Url = require('../models/url')
const User = require('../models/user')
const { sign } = require('../lib/auth')
const { getUserInfo } = require('../lib/oauth')

/* URL */
const getUrls = async (user) => {
  const urls = await Url.getByOwnerId({ ownerId: user.id })
  return urls
}

/* Query */
const login = async (_, { token: accessToken }) => {
  let info, user
  try {
    info = await getUserInfo(accessToken)
  } catch (e) {
    debug(e)
    throw new Error('Invalid token')
  }

  debug(info)
  const { email, name, picture, locale } = info
  try {
    // if found user, update info if different
    // todo: update info
    user = await User.getById({ email })
  } catch (e) {
    // if not found, then register
    // todo: check not found
    user = new User({ id: email, name, avatar: picture, locale })
    await user.create()
  }

  const token = sign({ email: user.id })
  debug({ token })
  return { token }
}

/* Mutation */

module.exports = {
  getUrls,
  login
}
