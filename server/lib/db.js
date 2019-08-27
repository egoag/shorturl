const https = require('https')
const { promisify } = require('util')
const AWS = require('aws-sdk')

const Limit = 10
const TableName = 'ShortUrl'
const UserIndex = 'UserIndex'

AWS.config.update({
  httpOptions: {
    // https://theburningmonk.com/2019/02/lambda-optimization-tip-enable-http-keep-alive/
    agent: new https.Agent({
      keepAlive: true,
      maxSockets: 50,
      rejectUnauthorized: true
    })
  },
  region: 'ap-southeast-2'
})

const TableInput = {
  TableName,
  KeySchema: [{
    AttributeName: 'urlId',
    KeyType: 'HASH'
  }, {
    AttributeName: 'varies',
    KeyType: 'RANGE'
  }],
  AttributeDefinitions: [{
    AttributeName: 'urlId',
    AttributeType: 'S'
  }, {
    AttributeName: 'varies',
    AttributeType: 'S'
  }, {
    AttributeName: 'ownerId',
    AttributeType: 'S'
  }, {
    AttributeName: 'updatedAt',
    AttributeType: 'S'
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  },
  GlobalSecondaryIndexes: [{
    IndexName: UserIndex,
    KeySchema: [{
      AttributeName: 'ownerId',
      KeyType: 'HASH'
    }, {
      AttributeName: 'updatedAt',
      KeyType: 'RANGE'
    }],
    Projection: {
      ProjectionType: 'KEYS_ONLY'
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }]
}

const db = new AWS.DynamoDB()
const client = new AWS.DynamoDB.DocumentClient()

// promisify
db.createTable = promisify(db.createTable)
db.deleteTable = promisify(db.deleteTable)
client.batchGet = promisify(client.batchGet)
client.batchWrite = promisify(client.batchWrite)
client.delete = promisify(client.delete)
client.get = promisify(client.get)
client.put = promisify(client.put)
client.query = promisify(client.query)
client.scan = promisify(client.scan)
client.update = promisify(client.update)
client.transactGet = promisify(client.transactGet)
client.transactWrite = promisify(client.transactWrite)

const createTable = async () => {
  const data = await db.createTable(TableInput)
  return data
}

const deleteTable = async () => {
  const data = await db.deleteTable({
    TableName
  })
  return data
}

/**
 * Utils
 */
// normalize output, suits ScanOutput, QueryOutput
const pageParse = ({ Items, Count, LastEvaluatedKey, ScannedCount }, Cls) => {
  return {
    items: Items.map(item => new Cls(item)),
    count: Count,
    lastKey: LastEvaluatedKey,
    scannedCount: ScannedCount
  }
}

module.exports = {
  db,
  client,
  // For test
  createTable,
  deleteTable,
  // Constants
  Limit,
  UserIndex,
  TableName,
  // Utils
  pageParse
}
