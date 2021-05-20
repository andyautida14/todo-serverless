const { Entity } = require('dynamodb-toolbox')
const Table = require('../table')

const Todo = new Entity({
  name: 'Todo',
  table: Table,
  attributes: {
    PK: { partitionKey: true, hidden: true },
    SK: { sortKey: true, hidden: true },
    GSI1PK: { type: 'string', hidden: true },
    GSI1SK: { type: 'string', hidden: true },
    GSI2PK: { type: 'string', hidden: true },
    GSI2SK: { type: 'string', hidden: true },
    id: { type: 'string' },
    done: { type: 'boolean' },
    text: { type: 'string' }
  }
})

module.exports = Todo
