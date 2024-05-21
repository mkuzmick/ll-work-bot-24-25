const llog = require('learninglab-log')

module.exports = async (client, message, event) => {
  llog.cyan('Tester bot fired');
  llog.gray('Message:', message);
  llog.gray('Event:', event);
}
  