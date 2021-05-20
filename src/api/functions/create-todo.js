const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const SNSService = require('../lib/services/sns-service')
const response = require('../lib/util/response')

async function createTodo(event) {
  const todo = await TodoService.createTodo(event.body)
  await SNSService.publish(process.env, 'TOPIC_TODO_CREATED_ARN', todo)
  return response({ status: 201, body: todo })
}

const handler = middy(createTodo)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
