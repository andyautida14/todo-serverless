if(!process.env.IS_OFFLINE && process.env.IS_LOCAL) {
  // serverless-offline uses IS_OFFLINE, but invoke local uses IS_LOCAL
  process.env.IS_OFFLINE = process.env.IS_LOCAL
}

const { Table } = require('dynamodb-toolbox')
const { doc: DocumentClient } = require('serverless-dynamodb-client')

module.exports = new Table({
  DocumentClient,
  name: process.env.DB_NAME,
  partitionKey: 'PK',
  sortKey: 'SK',
  indexes: {
    GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
    GSI2: { partitionKey: 'GSI2PK', sortKey: 'GSI2SK' }
  }
})
