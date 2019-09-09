const url = require('url')
const axios = require('axios')
const debug = require('debug')('debug:lib:oauth')
const { OAuth: { Google } } = require('../config')

/**
 * Google oAuth Endpoint URL
 */
const getEndpoint = () => {
  return url.format({
    protocol: Google.Endpoint.Protocol,
    hostname: Google.Endpoint.HostName,
    pathname: Google.Endpoint.PathName,
    query: {
      scope: Google.Scope,
      client_id: Google.ClientId,
      redirect_uri: Google.Redirect,
      response_type: Google.ResponseType
    }
  })
}

/**
 * return: {
 *   sub: '103990934698606780000',
 *   name: 'NAME',
 *   given_name: '',
 *   family_name: '',
 *   picture: 'https://lh6.googleusercontent.com/-J_c_gM2Z8-w/AAAAAAAAAAI/AAAAAAAAIbo/e5HygWEOqoY/photo.jpg',
 *   email: 'xxx@gmail.com',
 *   email_verified: true,
 *   locale: 'zh-CN'
 * }
 */
const getUserInfo = async (token) => {
  const resp = await axios.get(Google.API, { headers: { Authorization: `Bearer ${token}` } })
  debug(resp.data)
  return resp.data
}

module.exports = {
  getEndpoint,
  getUserInfo
}
