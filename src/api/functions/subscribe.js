const get = require('lodash.get')
const middy = require('@middy/core')
const cors = require('@middy/http-cors')
const errorHandler = require('../lib/middlewares/error-handler')
const IotService = require('../lib/services/iot-service')
const RequestInvalid = require('../lib/errors/request-invalid')
const response = require('../lib/util/response')

async function subscribe(event) {
  const principal = get(event, 'requestContext.identity.cognitoIdentityId')

  if(!principal) {
    throw new RequestInvalid('No Principal.')
  }

  await IotService.allowClientSubscription(principal)
  return response({ status: 200, body: { principal } })
}

const handler = middy(subscribe)
  .use(cors())
  .use(errorHandler())

module.exports = { handler }
