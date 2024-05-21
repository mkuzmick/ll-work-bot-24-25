const llog = require('learninglab-log');
const translatorBot = require('../translator-bot');

module.exports = [
    {
        name: "gif-bot",
        trigger: "file",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => { 
            llog.blue("got gif-bot request", message)
            await say("gif-bot will respond")
        }
    },
    {
        name: "director-bot",
        trigger: "name",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => {
            llog.blue("got director-bot request", message)
            const slackResult = await client.chat.postMessage({
                channel: message.channel,
                // text: chatResponse.choices[0].message.content,
                text: "the Director will respond",
                icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
                username: "Director"
                // text: "got some text, but saving secretly in the console"
    
            });
        }
    },
    {
        name: "code-tutor-bot",
        trigger: "file",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => {
            llog.blue("got code-tutor-bot request", message)
            const slackResult = await client.chat.postMessage({
                channel: message.channel,
                // text: chatResponse.choices[0].message.content,
                text: "the code-tutor will respond",
                // icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
                username: "Code Tutor"
                // text: "got some text, but saving secretly in the console"
    
            });
        }
    },
    translatorBot,
    {
        name: "poetry-tutor-bot",
        trigger: "name",
        channel_ids: ["C06995V5N94"],
        image: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
        function: async ({ client, message, say }) => {
            llog.blue("got code-tutor-bot request", message)
            const slackResult = await client.chat.postMessage({
                channel: message.channel,
                // text: chatResponse.choices[0].message.content,
                text: "the poetry-tutor will respond",
                // icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F063L8594N5/mkll_02138_a_bot_version_of_shakespeare_realistic_closeup_c3af60d3-3f31-4cff-a8a9-94ec517a8d76.png?pub_secret=353634cc30",
                username: "Poetry Tutor"
                // text: "got some text, but saving secretly in the console"
    
            });
        }
    },
]
