const { DB: { TableName, UserIndex } } = require('./config')

module.exports = {
  tables: [
    {
      TableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'version', KeyType: 'RANGE' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: UserIndex,
          KeySchema: [
            { AttributeName: 'ownerId', KeyType: 'HASH' },
            { AttributeName: 'updatedAt', KeyType: 'RANGE' }
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'version', AttributeType: 'S' },
        { AttributeName: 'ownerId', AttributeType: 'S' },
        { AttributeName: 'updatedAt', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  port: 8396
}
