const middy = require('@middy/core')
const errorLogger = require('@middy/error-logger')
const snsEvent = require('../lib/middlewares/sns-event')
const IotService = require('../lib/services/iot-service')

async function handleUndone(event) {
  const todo = event.message
  await IotService.publish(`todo/${todo.id}/undone`, todo)
}

const handler = middy(handleUndone)
  .use(snsEvent())
  .use(errorLogger())

module.exports = { handler }
