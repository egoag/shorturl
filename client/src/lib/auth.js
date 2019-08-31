import Dayjs from 'dayjs'

const IsLoggedIn = () => {
  const now = Dayjs()
  const token = localStorage.getItem('token')
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')

  return token && tokenExpiresAt && Dayjs(tokenExpiresAt).isAfter(now)
}

const AuthHeaders = () => {
  const headers = {}
  const token = localStorage.getItem('token')
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')
  if (token && tokenExpiresAt) {
    const now = Dayjs()
    const expiresAt = Dayjs(tokenExpiresAt)
    if (expiresAt.isAfter(now)) {
      headers['authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

export {
  IsLoggedIn,
  AuthHeaders
}
