const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const SNSService = require('../lib/services/sns-service')
const response = require('../lib/util/response')

async function setToDone(event) {
  const { id } = event.pathParameters
  const todo = await TodoService.setToDone(id)
  await SNSService.publish(process.env, 'TOPIC_TODO_DONE_ARN', todo)
  return response({ body: todo })
}

const handler = middy(setToDone)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
