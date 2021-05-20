const middy = require('@middy/core')
const snsEvent = require('../lib/middlewares/sns-event')
const errorHandler = require('../lib/middlewares/error-handler')

async function handleUndone(event) {
  console.log(event.message)
  // TODO: publish to IoT
}

const handler = middy(handleUndone)
  .use(snsEvent())
  .use(errorHandler())

module.exports = { handler }
