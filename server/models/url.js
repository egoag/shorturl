const debug = require('debug')('debug:model:url')

const randomId = require('../lib/randomId')
const { client, pageParse, TableName, Limit } = require('../lib/db')

const SET_EXP = 'set #url = :url, latest = :latest, ownerId = :ownerId, createdAt = :createdAt, updatedAt = :updatedAt'
const SET_EXP_NAMES = { '#url': 'url' }

/**
 *{
 *  id: Partition Key, String, 'a1F0Z7',
 *  varies: Sort Key, String, 'V0'(latest), 'V1'...,
 *  url: full url, String, 'http://localhost',
 *  latest: latest version, Nuber, 0
 *  ownerId: owner id, email, '92bc7bb8-2eb7-4d3b-a769-05eb25e0ab31',
 *  createdAt: created time, ISO8601, '2019-08-10T15:57:10+0000',
 *  updatedAt: updated time, ISO8601, '2019-08-10T15:57:10+0000'
 *}
 */
class Url {
  constructor ({ urlId, varies, url, latest, ownerId, createdAt, updatedAt }) {
    this.id = urlId || randomId()
    this.varies = varies || 'V0'
    this.url = url
    this.latest = latest || 0
    this.ownerId = ownerId
    this.createdAt = createdAt || new Date().toISOString()
    this.updatedAt = updatedAt || new Date().toISOString()
  }

  static async list ({ lastKey, limit = Limit, asc = true }) {
    const data = await client.scan({
      TableName,
      Limit: limit,
      ScanIndexForward: asc,
      ExclusiveStartKey: lastKey
    })

    debug(data)
    return pageParse(data, Url)
  }

  static async getById ({ id, varies = 'V0' }) {
    // get latest by default
    const data = await client.get({
      TableName,
      Key: {
        urlId: id,
        varies: varies
      }
    })

    debug(data)
    if (!data || !data.Item) {
      return null
    } else {
      return new Url(data.Item)
    }
  }

  static async getByIdAllVersion ({ id, lastKey, limit = Limit, asc = true }) {
    const data = await client.query({
      TableName,
      KeyConditionExpression: 'urlId = :urlId',
      ExpressionAttributeValues: { ':urlId': id },
      Limit: limit,
      ScanIndexForward: asc,
      ExclusiveStartKey: lastKey
    })

    debug(data)
    return pageParse(data, Url)
  }

  // static async getByOwnerId ({ ownerId, lastKey, limit = Limit, asc = true }) {
  //   // get latest version
  //   const data = await client.query({
  //     TableName,
  //     IndexName: UserIndex,
  //     KeyConditionExpression: 'ownerId = :ownerId',
  //     FilterExpression: 'varies = :varies',
  //     ExpressionAttributeValues: {
  //       ':varies': 'V0',
  //       ':ownerId': ownerId
  //     },
  //     Limit: limit,
  //     ScanIndexForward: asc,
  //     ExclusiveStartKey: lastKey
  //   })

  //   debug(data)
  //   return pageParse(data, Url)
  // }

  async getAllVersion ({ lastKey, limit = Limit, asc = true }) {
    const objects = await Url.getByIdAllVersion({ id: this.id, lastKey, limit, asc })
    return objects
  }

  async create () {
    const data = await client.put({
      TableName,
      Item: this._toItem()
    })
    debug(data)
  }

  async updateUrl (url) {
    this.url = url
    await this._update()
  }

  async delete () {
    if (this.latest > 0) {
      // batch delete
      // todo: handle batch errors
      const keys = this._getAllVersionKeys()
      if (keys.length + 1 > 25) {
        // split into 25-items tasks
        const batches = []
        for (let i = 0; i < Math.ceil((keys.length + 1) / 25); i++) {
          const task = client.batchWrite({
            RequestItems: {
              [TableName]: keys.slice(i * 25, (i + 1) * 25).map(key => ({ DeleteRequest: { Key: key } }))
            }
          })
          batches.push(task)
        }
        // run tasks parallel
        const data = await Promise.all(batches)
        debug(data)
      } else {
        // single batch delete operation
        const data = await client.batchWrite({
          RequestItems: {
            [TableName]: keys.map(key => ({ DeleteRequest: { Key: key } }))
          }
        })
        debug(data)
      }
    } else {
      // single delete
      const keys = this._getKeys()
      const data = await client.delete({
        TableName,
        Key: keys
      })
      debug(data)
    }
  }

  _getVaries (latest) {
    // by default use this.latest
    return `V${latest !== undefined ? latest : this.latest}`
  }

  _getKeys () {
    return {
      urlId: this.id,
      varies: this.varies
    }
  }

  _getAllVersionKeys () {
    const keys = []
    for (let i = 0; i <= this.latest; i++) {
      keys.push({
        urlId: this.id,
        varies: this._getVaries(i)
      })
    }
    debug(keys)
    return keys
  }

  _getAttrs () {
    return {
      url: this.url,
      latest: this.latest,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  _toItem () {
    return {
      ...this._getKeys(),
      ...this._getAttrs()
    }
  }

  /**
   * Used for expression values
   */
  _getAttrValues () {
    return {
      ':url': this.url,
      ':latest': this.latest,
      ':ownerId': this.ownerId,
      ':createdAt': this.createdAt,
      ':updatedAt': this.updatedAt
    }
  }

  /**
   * Not support deleting attributes, modifying nested/set attributes
   * Version control: update by modifying 'V0' and creating new version object by transaction
   */
  async _update () {
    // update this attributes
    this.updatedAt = new Date().toISOString()
    this.latest += 1 // increase latest number by 1

    // update v0
    const v0Attrs = this._getAttrValues()

    // create a new version
    const newAttrs = this._getAttrs()
    delete newAttrs.latest // only v0 needs to keep track of latest number
    const newItem = {
      urlId: this.id, // same partition key
      varies: this._getVaries(), // increase sort key by 1
      ...newAttrs
    }

    const data = await client.transactWrite({
      TransactItems: [{
        Put: {
          TableName,
          Item: newItem
        }
      }, {
        Update: {
          TableName,
          Key: this._getKeys(),
          UpdateExpression: SET_EXP,
          ExpressionAttributeNames: SET_EXP_NAMES,
          ExpressionAttributeValues: v0Attrs,
          ReturnValues: 'UPDATED_NEW'
        }
      }]
    })

    debug(data)
    return data
  }
}

module.exports = Url
