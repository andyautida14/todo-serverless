const AWS = require('aws-sdk')
const iot = new AWS.Iot()
let _iotData

const stage = process.env.STAGE
const policies = [
  `todo-serverless-${stage}-connect-policy`,
  `todo-serverless-${stage}-subscribe-policy`,
  `todo-serverless-${stage}-receive-policy`
]

const IotService = {
  async allowClientSubscription(principal) {
    try {
      for(const policyName of policies) {
        await iot.attachPrincipalPolicy({ principal, policyName }).promise()
      }
    } catch(e) {
      console.error(e)
      throw e
    }
  },
  publish(topic, payload) {
    const iotData = this._getIotData()
    const payloadStr = typeof payload === 'string'
      ? payload : JSON.stringify(payload)
    return iotData.publish({
      topic: `${stage}/${topic}`,
      payload: payloadStr
    }).promise()
  },
  _getIotData() {
    if(!_iotData) {
      _iotData = new AWS.IotData({
        endpoint: process.env.IOT_ENDPOINT_ADDRESS
      })
    }
    return _iotData
  }
}

module.exports = IotService
