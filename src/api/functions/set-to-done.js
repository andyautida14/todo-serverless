const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const response = require('../lib/util/response')

async function setToDone(event) {
  const { id } = event.pathParameters
  const todo = await TodoService.setToDone(id)
  return response({ body: todo })
}

const handler = middy(setToDone)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
