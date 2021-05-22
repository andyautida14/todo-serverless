const middy = require('@middy/core')
const errorLogger = require('@middy/error-logger')
const snsEvent = require('../lib/middlewares/sns-event')
const IotService = require('../lib/services/iot-service')

async function handleCreated(event) {
  const todo = event.message
  await IotService.publish(`todo/${todo.id}/created`, todo)
}

const handler = middy(handleCreated)
  .use(snsEvent())
  .use(errorLogger())

module.exports = { handler }
