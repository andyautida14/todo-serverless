function response({ status = 200, body, headers } = {}) {
  return {
    statusCode: status,
    body: JSON.stringify(body),
    headers
  }
}

module.exports = response
