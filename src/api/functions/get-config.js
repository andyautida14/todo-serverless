const middy = require('@middy/core')
const response = require('../lib/util/response')

async function getConfig() {
  const config = {
    auth: {
      region: process.env.AWS_REGION || 'ap-southeast-1',
      identityPoolId: process.env.IDENTITY_POOL_ID
    },
    stage: process.env.STAGE,
    apiGatewayUrl: process.env.API_GATEWAY_URL,
    iotEndpoint: process.env.IOT_ENDPOINT_ADDRESS
  }
  return response({ body: config })
}

const handler = middy(getConfig)

module.exports = { handler }
