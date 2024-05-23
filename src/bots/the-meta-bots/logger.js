const llog = require('learninglab-log')

module.exports = async ({client, message, event, say}) => {
  llog.cyan(llog.divider, 'Logging bot fired', llog.divider);
  if (event) {
    llog.gray('Event:', event);
  }
  if (message) {
    llog.gray('Message:', message);
  }
  return("logging complete")
}
  