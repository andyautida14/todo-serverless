const axios = require('axios')
const AWS = require('aws-sdk')

async function handler(event, context) {
  if(event.RequestType === 'Delete') {
    await sendResponse(event, context, "SUCCESS")
    return
  }

  const iot = new AWS.Iot()
  try {
    const { endpointAddress } = await iot.describeEndpoint({
      endpointType: 'iot:Data-ATS'
    }).promise()
    await sendResponse(event, context, 'SUCCESS', {
      IotEndpointAddress: endpointAddress
    })
  } catch(e) {
    await sendResponse(event, context, 'FAILED', {
      Error: e.message
    })
  }
}

async function sendResponse(event, context, status, data) {
  const body = {
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Status: status,
    Data: data
  }

  try {
    await axios.put(event.ResponseURL, body)
    console.log('IotEndpointProvider Send Response Success:', data)
  } catch(e) {
    console.error('IotEndpointAddress Send Response Failed:', e)
  } finally {
    context.done()
  }
}

module.exports = { handler }
