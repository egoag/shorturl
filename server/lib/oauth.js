const axios = require('axios')

const GAPI = 'https://www.googleapis.com/oauth2/v3/userinfo'

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
  getUserInfo
}
