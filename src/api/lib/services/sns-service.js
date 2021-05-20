const AWS = require('aws-sdk')
const SNS = new AWS.SNS()

const SNSService = {
  async publish(env, varName, message, opts = {}) {
    const topicArn = env[varName]
    if(!topicArn) {
      console.warn(`Topic ARN Environment Variable '${varName}' is not configured. Skipping publish...`)
      return
    }

    if(!topicArn.startsWith('arn')) {
      console.warn(`Invalid Topic ARN for Environment Variable '${varName}': '${topicArn}'. Skipping publish...`)
      return
    }

    return SNS.publish({
      TopicArn: topicArn,
      Message: typeof message === 'string' ? message : JSON.stringify(message),
      ...opts
    }).promise()
  }
}

module.exports = SNSService
