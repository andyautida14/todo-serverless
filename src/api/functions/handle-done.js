const middy = require('@middy/core')
const snsEvent = require('../lib/middlewares/sns-event')
const errorHandler = require('../lib/middlewares/error-handler')

async function handleDone(event) {
  console.log(event.message)
  // TODO: publish to IoT
}

const handler = middy(handleDone)
  .use(snsEvent())
  .use(errorHandler())

module.exports = { handler }
