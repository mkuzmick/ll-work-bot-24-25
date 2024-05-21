const loggingBotIcon = `https://files.slack.com/files-pri/T0HTW3H0V-F06DZDMUJ5N/logger.gif?pub_secret=7271280a9d`

const logToSlack = async ({ client, text }) => {
    let slackResult = await client.chat.postMessage({
        channel: process.env.SLACK_LOGGING_CHANNEL,
        text: text,
        icon_emoji: ":logger:",
        username: "Logging Bot"
    })
}

module.exports = logToSlack;