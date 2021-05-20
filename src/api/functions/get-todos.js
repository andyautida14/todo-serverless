const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const response = require('../lib/util/response')

async function getTodos(event) {
  const todos = await TodoService.getTodos()
  return response({ status: 201, body: todos })
}

const handler = middy(getTodos)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
