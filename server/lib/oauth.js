const url = require('url')
const axios = require('axios')

const GAPI = 'https://www.googleapis.com/oauth2/v3/userinfo'

const OAUTH_SCOPE = 'profile email'
const OAUTH_REDIRECT = 'http://localhost:3000'
const OAUTH_CLIENT_ID = '341216547983-vmsjdifmov7unpr6jsi57h7e2eqgb14r.apps.googleusercontent.com'
const OAUTH_RESPONSE_TYPE = 'token'

/**
 * Google oAuth Endpoint URL
 */
const getEndpoint = () => {
  return url.format({
    protocol: 'https',
    hostname: 'accounts.google.com',
    pathname: '/o/oauth2/v2/auth',
    query: {
      scope: OAUTH_SCOPE,
      client_id: OAUTH_CLIENT_ID,
      redirect_uri: OAUTH_REDIRECT,
      response_type: OAUTH_RESPONSE_TYPE
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
  const resp = await axios.get(GAPI, { headers: { Authorization: `Bearer ${token}` } })
  return resp.data
}

module.exports = {
  getEndpoint,
  getUserInfo
}
