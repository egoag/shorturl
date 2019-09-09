const https = require('https')
const { promisify } = require('util')
const AWS = require('aws-sdk')

const Limit = 10
const TableName = 'ShortUrl'
const UserIndex = 'UserIndex'
const GLOBAL_REGION = 'us-east-1'

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

const acm = new AWS.ACM({ region: GLOBAL_REGION })
const client = new AWS.DynamoDB.DocumentClient({})
const apiGateway = new AWS.APIGateway()

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
