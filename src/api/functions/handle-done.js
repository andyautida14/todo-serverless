const middy = require('@middy/core')
const errorLogger = require('@middy/error-logger')
const snsEvent = require('../lib/middlewares/sns-event')
const IotService = require('../lib/services/iot-service')

async function handleDone(event) {
  const todo = event.message
  await IotService.publish(`todo/${todo.id}/done`, todo)
}

const handler = middy(handleDone)
  .use(snsEvent())
  .use(errorLogger())

module.exports = { handler }
