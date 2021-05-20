const middy = require('@middy/core')
const bodyParser = require('@middy/http-json-body-parser')
const errorHandler = require('../lib/middlewares/error-handler')
const TodoService = require('../lib/services/todo-service')
const response = require('../lib/util/response')

async function getDone(event) {
  const todos = await TodoService.getDone()
  return response({ status: 201, body: todos })
}

const handler = middy(getDone)
  .use(bodyParser())
  .use(errorHandler())

module.exports = { handler }
