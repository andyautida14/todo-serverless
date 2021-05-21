const AWS = require('aws-sdk')

const stage = process.env.STAGE
const policies = [
  `todo-${stage}-connect-policy`,
  `todo-${stage}-subscribe-policy`,
  `todo-${stage}-receive-policy`
]

const IotService = {
  async allowClientSubscription(principal) {
    console.log('allowClientSubscription', principal)
    try {
      const iot = new AWS.Iot()
      for(const policyName of policies) {
        console.log('attaching policyName', policyName)
        await iot.attachPrincipalPolicy({ principal, policyName }).promise()
      }
    } catch(e) {
      console.error(e)
      throw e
    }
  },
  publish(topic, payload) {
    const iotData = new AWS.IotData()
  }
}

module.exports = IotService
