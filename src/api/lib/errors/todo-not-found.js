const GenericError = require('./generic-error')

class TodoNotFound extends GenericError {
  constructor(id) {
    super(404, `Todo with id ${id} is not found.`)
  }
}

module.exports = TodoNotFound
