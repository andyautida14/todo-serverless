const GenericError = require('../errors/generic-error')

module.exports = (opts) => {
  const defaults = {
    logger: console.error
  }

  const options = Object.assign({}, defaults, opts)

  return {
    async onError(request) {
      if(request.error instanceof GenericError) {
        if(typeof options.logger === 'function') {
          options.logger(request.error)
        }

        return {
          statusCode: request.error.status,
          body: JSON.stringify({
            result: 'FAIL',
            error: request.error.toJSON()
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }

      return {
        statusCode: 500,
        body: JSON.stringify({
          result: 'FAIL',
          error: request.error.message
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  }
}
