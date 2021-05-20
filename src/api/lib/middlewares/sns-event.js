module.exports = () => {
  return {
    async before(request) {
      const [ record ] = request.event.Records
      const notification = record.Sns
      const message = JSON.parse(notification.Message)

      request.event.record = record
      request.event.notification = notification
      request.event.message = message
    }
  }
}
