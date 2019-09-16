const AWS = require('aws-sdk')
const https = require('https')
const { promisify } = require('util')
const { DB: { Region, SslEnabled, Endpoint, TableName, UserIndex, DefaultLimit: Limit } } = require('../config')

const GLOBAL_REGION = 'us-east-1'

// Default client
const dbOptions = {
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
}

const acm = new AWS.ACM({ region: GLOBAL_REGION })
const client = new AWS.DynamoDB.DocumentClient(dbOptions)
const apiGateway = new AWS.APIGateway({ region: Region })

// promisify
acm.requestCertificate = promisify(acm.requestCertificate)
acm.describeCertificate = promisify(acm.describeCertificate)
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
apiGateway.createDomainName = promisify(apiGateway.createDomainName)
apiGateway.getDomainName = promisify(apiGateway.getDomainName)
apiGateway.createBasePathMapping = promisify(apiGateway.createBasePathMapping)
apiGateway.getBasePathMapping = promisify(apiGateway.getBasePathMapping)
apiGateway.getBasePathMappings = promisify(apiGateway.getBasePathMappings)

/**
 * Utils
 */
// normalize output, suits ScanOutput, QueryOutput
const pageParse = ({ Items, Count, LastEvaluatedKey, ScannedCount }, Cls) => {
  return {
    items: Items.map(item => new Cls(item)),
    count: Count,
    lastKey: JSON.stringify(LastEvaluatedKey),
    scannedCount: ScannedCount
  }
}

module.exports = {
  acm,
  client,
  apiGateway,
  // Constants
  Limit,
  UserIndex,
  TableName,
  // Utils
  pageParse
}
