const https = require('https')
const { DynamoDB: { DocumentClient } } = require('aws-sdk')
const { toUpdateExpression, toConditionExpression } = require('./expression')
const { DB: { Region, SslEnabled, Endpoint, TableName, DefaultLimit } } = require('../../config')

// Default client
const Client = new DocumentClient({
  region: Region,
  endpoint: Endpoint,
  sslEnabled: SslEnabled,
  httpOptions: !SslEnabled ? undefined : {
    agent: new https.Agent({
      keepAlive: true, // optimazation
      maxSockets: 50,
      rejectUnauthorized: true
    })
  }
})

// key parser and seriliaze
const _parseKey = sKey => sKey ? JSON.parse(sKey) : sKey
const _stringifyKey = key => key ? JSON.stringify(key) : key
const _paginate = data => {
  const { Items, Count, ScannedCount, LastEvaluatedKey } = data
  return {
    items: Items,
    count: Count,
    scaned: ScannedCount,
    next: LastEvaluatedKey ? _stringifyKey(LastEvaluatedKey) : null
  }
}

/**
 * pagination result
 *
 * @typedef {Object} Pagination
 * @property {Array} items array of documents
 * @property {Number} scaned document number scaned
 * @property {Number} count document number in array
 * @property {String} next next document primary key string
 */
/**
 * dynamodb options
 *
 * @typedef {Object} Options
 * @property {String} index secondary index name
 * @property {DocumentClient} client default dynamodb client
 * @property {string} returnValue return values: UPDATED_NEW(default)|NONE|ALL_OLD|UPDATED_OLD|ALL_NEW
 */
const DefaultOptions = { client: Client, index: null, returnValue: 'UPDATED_NEW' }
/**
 * page request
 * @typedef {Object} Paginate
 * @property {String} from starts from the primary key
 * @property {Number} limit number limit
 * @property {Boolean} asc asc or desc
 */
const DefaultPage = { from: null, limit: DefaultLimit, asc: true }

/**
 * create document
 *
 * @param {Object} doc document to be created
 * @param {Options} options default dynamodb client
 * @returns {null}
 */
const Create = async (doc, { client = Client } = DefaultOptions) => {
  await client.put({
    TableName,
    Item: doc
  }).promise()
}

/**
 * get document by primary key
 * @param {Object} key hash key and range key object
 * @param {Options} options default dynamodb client
 * @returns {Object|null} document returned from database, or null for not exists.
 */
const Get = async (key, { client = Client } = DefaultOptions) => {
  const { Item: data } = await client.get({
    TableName,
    Key: key
  }).promise()

  return data
}

/**
 * scan index
 *
 * @param {Paginate} page
 * @param {Options} options default dynamodb client
 * @returns {Pagination}
 */
const Scan = async ({ from, limit = DefaultLimit, asc = true } = DefaultPage, { index = null, client = Client } = DefaultOptions) => {
  const data = await client.scan({
    TableName,
    Limit: limit,
    IndexName: index,
    ScanIndexForward: asc,
    ExclusiveStartKey: _parseKey(from)
  }).promise()

  return _paginate(data)
}

/**
 * query
 *
 * @param {Object} key hash key and range key filter, format: {HASH_KEY: "CERTAIN_VALUE", RANGE_KEY: BEGINS('prefix')}
 * @param {Object} filter other properties filter, format: {FIELD: CONDITION, $and: [], ...}
 * @param {Paginate} page
 * @param {Options} options default dynamodb client
 * @returns {Pagination}
 */
const Query = async (key, filter, { from, limit = DefaultLimit, asc = true } = DefaultPage, { index = null, client = Client } = DefaultOptions) => {
  const { expression: keyExp, names: keyNames, values: keyValues } = toConditionExpression(key)
  const { expression: filterExp, names: filterNames, values: filterValues } = toConditionExpression(filter)
  const params = {
    TableName,
    IndexName: index,
    // key filter
    KeyConditionExpression: keyExp,
    // others filter
    FilterExpression: filterExp || undefined,
    // filter names
    ExpressionAttributeNames: { ...keyNames, ...filterNames },
    // filter values
    ExpressionAttributeValues: { ...keyValues, ...filterValues },
    // pagination
    Limit: limit,
    ScanIndexForward: asc,
    ExclusiveStartKey: _parseKey(from)
  }

  const data = await client.query(params).promise()

  return _paginate(data)
}

/**
 * update a document, operations:
 * - ADD: set attributes to document
 * - SET: add attributes to document
 * - REMOVE: remove attributes from document
 * - DELETE: delete elements from set
 *
 * @param {Object} key certain hash key and range key filter, format: {HASH_KEY: HASK_VALUE, RANGE_KEY: RANGE_VALUE}
 * @param {Object} update update object, format: {FIELD1: VALUE1, FIELD2: ADD(VALUE2), ...}
 * @param {Options} options not support secondary index
 * @returns {Object} new document(by default).
 */
const Update = async (key, update, { client = Client, returnValue = 'ALL_NEW' } = DefaultOptions) => {
  const { expression, names, values } = toUpdateExpression(update)
  const params = {
    TableName,
    Key: key,
    UpdateExpression: expression,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: returnValue
  }

  const { Attributes: data } = await client.update(params).promise()

  return data
}

/**
 * delete a document
 *
 * @param {Object} key hash key and range key object
 * @param {Options} options not support secondary index
 */
const Delete = async (key, { client = Client } = DefaultOptions) => {
  const { Attributes: data } = await client.delete({
    TableName,
    Key: key,
    ReturnValues: 'ALL_OLD'
  }).promise()

  return data
}

module.exports = {
  Client,
  // C
  Create,
  // R
  Get,
  Scan,
  Query,
  // U
  Update,
  // D
  Delete
}
