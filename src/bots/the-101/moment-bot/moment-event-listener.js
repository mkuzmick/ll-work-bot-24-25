const airtableTools = require(`../../utils/ll-airtable-tools`)
const llog = require('learninglab-log')

const momentEventListener =  async ({ event }) => {
    const handledEvents = ["message","reaction_added", "reaction_removed", "app_home_opened", "file_shared"]
    try {
        if (handledEvents.includes(event.type)) {
            llog.blue(`got an event of type ${event.type}, handling this elsewhere`)
            // magenta(event)
          } else {
            llog.yellow(`currently unhandled event of type ${event.type}:`)
            llog.cyan(JSON.stringify(event))
          }
          llog.red(event)
          let theRecord = {
              EventType: event.type,
              UserId: event.user || "NA",
              SlackChannelId: (event.item && event.item.channel) || (event.channel) || "NA" ,
              SlackEventTs: event.event_ts,
              SlackJSON: JSON.stringify(event, null, 4)
          }
          let theResult = await airtableTools.addRecord({
              baseId: process.env.AIRTABLE_MOMENTS_BASE,
              table: "SlackEvents",
              record: theRecord
          })
          llog.cyan(theResult)
    } catch (error) {
        llog.red(error)
    }
    

}

module.exports = momentEventListener