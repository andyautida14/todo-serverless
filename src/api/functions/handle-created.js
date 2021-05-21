const middy = require('@middy/core')
const snsEvent = require('../lib/middlewares/sns-event')
const errorHandler = require('../lib/middlewares/error-handler')
const IotService = require('../lib/services/iot-service')

async function handleCreated(event) {
  const todo = event.message
  // await IotService.publish(`todo/${todo.id}/created`, todo)
  console.log(event.message)
  // TODO: publish to IoT
}

const handler = middy(handleCreated)
  .use(snsEvent())
  .use(errorHandler())

module.exports = { handler }
