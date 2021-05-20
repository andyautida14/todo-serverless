const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const response = require('../lib/util/response')

async function createTodo(event) {
  const todo = await TodoService.createTodo(event.body)
  return response({ status: 201, body: todo })
}

const handler = middy(createTodo)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
