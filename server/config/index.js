const HOUR = 1000 * 60 * 60
const DAY = 24 * HOUR

module.exports = {
  Server: {
    Secret: 'jwt!',
    Expiration: 7 * DAY
  }
}
