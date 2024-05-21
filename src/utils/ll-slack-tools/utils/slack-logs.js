const llog = require('learninglab-log')

module.exports.events = async ({ event }) => {
    llog.darkgray(llog.divider, "event", event)
}

module.exports.views = async ({ ack, body, view, client }) => {
    await ack();
    llog.darkgray(llog.divider, "view", view)
    llog.darkgray(llog.divider, "body", body)
}


  
  