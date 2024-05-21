const llog = require('learninglab-log')
// add this logic back in somewhere to handle links
// const makeGif = require(`../bots/gif-bot/make-gif`);
// const momentBot = require(`../bots/moment-bot`)
// const huntResponse = require('../bots/open-ai-bot/hunt-response-1')
// const directorBot = require('../bots/director-bot')
// const howStudentsLearnResponse = require('../bots/experimental/how-students-learn-bot/bot-response');
// const pokemonBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F069XBVK6GP/elle.l.studio_pikachu_on_a_white_background_9c17635e-ea6e-47af-a191-95af2681a39d.jpg?pub_secret=27b8f2167e"
// const mkWorkBot = require('../bots/production/mk-work-bot');

// const studentBots = [
//     {name: "Pikachu", imageUrl: "https://files.slack.com/files-pri/T0HTW3H0V-F069XBVK6GP/elle.l.studio_pikachu_on_a_white_background_9c17635e-ea6e-47af-a191-95af2681a39d.jpg?pub_secret=27b8f2167e"},
//     {name: "Billowing Sail", imageUrl: "https://files.slack.com/files-pri/T0HTW3H0V-F06J9EFH08J/billowing-sail.jpg?pub_secret=c7f7f627c1"},
//     {name: "Petal Pink", imageUrl: "https://files.slack.com/files-pri/T0HTW3H0V-F06HUTBU2FR/petal-pink.jpg?pub_secret=0c1edb0843"}
// ]

const testingBot = require('../bots/the-meta-bots/testing-bot.js');

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say }) => {

    llog.magenta(`parsing all messages, including this one from ${message.channel}`);
    // let directorResult = await directorBot.respondToMessage({ client, message, say });
    if ( message.channel_type == "im" ) {
        llog.magenta(`handling message because ${message.channel} is a DM`)
        llog.yellow(message)
        let result = await client.conversations.history({channel: message.channel, limit: 10})
        llog.magenta(result)
        // let openAiResult = await howStudentsLearnResponse({ text: message.text, messages: result.messages });
        // llog.magenta(openAiResult)

        let slackResult = await client.chat.postMessage({
            channel: message.channel,
            text: `We are a group of bots, and we'll be at work responding to your message later: ${message.text}`,
            // icon_url: randomBot.imageUrl,
            // username: randomBot.name
        });

    } 
    // else if ( message.channel == process.env.SLACK_HSL_BOT_CHANNEL) {
    //     llog.cyan(`handling message because ${message.channel} is the HSL bot channel`);
    //     const hslBotResult = await howStudentsLearnResponse({ client, message });
    // } 
    
    else {
        llog.magenta(`some other message we aren't handling now--uncomment message-handler line 27 to get the json`)
        llog.blue(`message wasn't in array ${JSON.stringify(BOT_CONFIG.channels, null, 4)}`)
        llog.yellow(message)
    }
    if (message.channel==process.env.SLACK_WORK_CHANNEL) {
        // let mkWorkBotResult = await mkWorkBot.handleMessage({ client, message, say });
        llog.yellow(`handling message because ${message.channel} is the work channel`);
    }
}

