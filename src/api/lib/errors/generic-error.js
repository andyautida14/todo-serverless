class GenericError extends Error {
  constructor(status, message, details = {}) {
    super(message)
    this.status = this.status
    this._details = details
  }

  toJSON() {
    return {
      message: this.message,
      ...this._details
    }
  }
}

module.exports = GenericError
