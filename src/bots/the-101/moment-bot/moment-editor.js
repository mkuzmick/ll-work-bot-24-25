const airtableTools = require(`../../../utils/ll-airtable-tools`)
const llog = require('learninglab-log')

async function updateAirtableMoment (ts) {
    llog.cyan(llog.divider, `let's try to fix this moment: ${ts}`, llog.divider)
    // need to track down original item in here too
    let airtableResult = await airtableTools.findOneByValue({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackMessages",
        value: ts,
        field: "SlackTs",
    })

    let theRecord = {
        OriginalItemSlackTs: event.item.ts  || "",
        MomentEmojiSlackTs: event.event_ts  || "",
        SlackChannelId: event.item.channel || "",
        OriginalItemType: event.item.type  || "",
        OriginalItemUser: event.item_user  || "",
        SlackJSON: JSON.stringify(event, null, 4),
        Status: "Launched"
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "Moments",
        record: theRecord
    })
    // now let's start a comment thread
    return theResult
}





