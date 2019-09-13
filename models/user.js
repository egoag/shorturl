const debug = require('debug')('debug:model:user')

const Url = require('./url')
const { client, TableName, UserIndex, Limit } = require('../lib/aws')

const VARIES = 'user'
const AVATAR = 'https://lh6.googleusercontent.com/-J_c_gM2Z8-w/AAAAAAAAAAI/AAAAAAAAIbo/e5HygWEOqoY/photo.jpg'

/**
 *{
 *  id: Partition Key, String(email),
 *  varies: Sort Key, String('user'),
 *  avatar: Avatar URL, String(URL)
 *}
 */
class User {
  constructor ({ id, urlId, varies, name, avatar, locale }) {
    this.id = id || urlId
    this.name = name
    this.avatar = avatar || AVATAR
    this.varies = varies || VARIES
    this.locale = locale
  }

  static async getById (id) {
    const data = await client.get({
      TableName,
      Key: {
        urlId: id,
        varies: VARIES
      }
    })

    debug(data)
    if (!data || !data.Item) {
      return null
    } else {
      return new User(data.Item)
    }
  }

  static async getUrlsByOwnerId ({ ownerId, lastKey, limit = Limit, asc = false }) {
    const data = await client.query({
      TableName,
      IndexName: UserIndex,
      FilterExpression: 'varies = :varies',
      KeyConditionExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: {
        ':varies': 'V0',
        ':ownerId': ownerId
      },
      Limit: limit,
      ScanIndexForward: asc,
      ExclusiveStartKey: lastKey
    })
    debug(data)

    const { Items: UrlKeys, Count, LastEvaluatedKey, ScannedCount } = data
    const urlTasks = UrlKeys.map(key => Url.getById({ id: key.urlId, varies: key.varies }))
    const items = await Promise.all(urlTasks)

    return {
      id: ownerId,
      items: items,
      count: Count,
      lastKey: JSON.stringify(LastEvaluatedKey),
      scannedCount: ScannedCount
    }
  }

  /**
   * Slow
   */
  async getUrls ({ lastKey, limit = Limit, asc = false }) {
    const urls = await User.getUrlsByOwnerId({ ownerId: this.id, lastKey, limit, asc })
    return urls
  }

  async create () {
    const data = await client.put({
      TableName,
      Item: this._toItem()
    })

    debug(data)
  }

  async update () {
    // todo: implement
  }

  async delete () {
    // todo: implement
  }

  _toItem () {
    return {
      urlId: this.id,
      name: this.name,
      varies: this.varies,
      avatar: this.avatar,
      locale: this.locale
    }
  }
}

module.exports = User
