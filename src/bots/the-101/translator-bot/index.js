const llog = require('learninglab-log')

module.exports = {
    name: "translator-bot",
    trigger: "name",
    channel_ids: ["C0682M6AHHR", "C0613V5C1SP", "C06995V5N94"],
    image: "https://files.slack.com/files-pri/T0HTW3H0V-F069G2PTF54/benjamin-002.jpg?pub_secret=97f61d0f67",
    function: async ({ client, message, say }) => {
        llog.blue("got translator-bot request", message)
        const slackResult = await client.chat.postMessage({
            channel: message.channel,
            // text: chatResponse.choices[0].message.content,
            text: "the Translator will respond",
            icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F069G2PTF54/benjamin-002.jpg?pub_secret=97f61d0f67",
            username: "The Translator"
            // text: "got some text, but saving secretly in the console"

        });
    }
}


// {
//     name: "translator-bot",
//     trigger: "channel",
//     channel_ids: ["C0682M6AHHR", "C0613V5C1SP", "C06995V5N94"],
//     image: "https://files.slack.com/files-pri/T0HTW3H0V-F069G2PTF54/benjamin-002.jpg?pub_secret=97f61d0f67",
//     function: async ({ client, message, say }) => {
//         llog.blue("got translator-bot request", message)
//         const slackResult = await client.chat.postMessage({
//             channel: message.channel,
//             // text: chatResponse.choices[0].message.content,
//             text: "the Translator will respond",
//             icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F069G2PTF54/benjamin-002.jpg?pub_secret=97f61d0f67",
//             username: "The Translator"
//             // text: "got some text, but saving secretly in the console"

//         });
//     }
// },