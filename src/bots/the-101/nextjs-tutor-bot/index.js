module.exports = {
    name: "nextjs-tutor-bot",
    trigger: "name",
    channel_ids: ["C0682M6AHHR", "C0613V5C1SP", "C06995V5N94"],
    image: "https://files.slack.com/files-pri/T0HTW3H0V-F069MUKLK1C/code-tutor-bot.jpg?pub_secret=010c61d59c",
    function: async ({ client, message, say }) => {
        llog.blue("got translator-bot request", message)
        const slackResult = await client.chat.postMessage({
            channel: message.channel,
            // text: chatResponse.choices[0].message.content,
            text: "the Translator will respond",
            icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F069MUKLK1C/code-tutor-bot.jpg?pub_secret=010c61d59c",
            username: "next-js-tutor-bot"
            // text: "got some text, but saving secretly in the console"

        });
    }
}

