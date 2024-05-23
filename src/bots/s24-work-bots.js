const llog = require('learninglab-log');

module.exports = async ({client, message, say}) => {
    llog.magenta(`the work bot is running, <@${message.user}>!`);
    llog.blue(message);
    // await say(`the personal bot is running, <@${message.user}>!`);

    // let result = await client.conversations.history({channel: message.channel, limit: 10})
    // llog.magenta(result)
    // let openAiResult = await howStudentsLearnResponse({ text: message.text, messages: result.messages });
    // llog.magenta(openAiResult)

    // let slackResult = await client.chat.postMessage({
    //     channel: message.channel,
    //     text: `We are a group of bots , and we'll be at work responding to your message later, <@${message.user}>. For now we are still working on connecting to various AI APIs.`,
    //     // icon_url: randomBot.imageUrl,
    //     // username: randomBot.name
    // });

}