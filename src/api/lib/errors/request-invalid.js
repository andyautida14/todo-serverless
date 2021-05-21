const GenericError = require('./generic-error')

class RequestInvalid extends GenericError {
  constructor(message) {
    super(400, message)
  }
}

module.exports = RequestInvalid
