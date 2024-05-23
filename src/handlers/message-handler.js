const llog = require('learninglab-log')
// add this logic back in somewhere to handle links
// const makeGif = require(`../bots/gif-bot/make-gif`);
// const momentBot = require(`../bots/moment-bot`)
// const huntResponse = require('../bots/open-ai-bot/hunt-response-1')
// const directorBot = require('../bots/director-bot')
// const howStudentsLearnResponse = require('../bots/experimental/how-students-learn-bot/bot-response');
// const pokemonBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F069XBVK6GP/elle.l.studio_pikachu_on_a_white_background_9c17635e-ea6e-47af-a191-95af2681a39d.jpg?pub_secret=27b8f2167e"
// const mkWorkBot = require('../bots/production/mk-work-bot');

const loggerBot = require('../bots/the-meta-bots/logger.js');
const directorBot = require('../bots/the-meta-bots/director.js');
const personalWorkBots = require('../bots/personal-workbots.js');
const s24WorkBots = require('../bots/s24-work-bots.js');

exports.testing = async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`the bot is running, <@${message.user}>!`);
}

exports.parseAll = async ({ client, message, say, event }) => {
    const loggerBotResult = await loggerBot({ client, message, say, event });
    const directorResult = await directorBot({ client, message, say, event });
    if ( message.channel_type == "im" ) {
       const personalWorkBotsResult = await personalWorkBots({ client, message, say });
    } else if ( message.channel == process.env.SLACK_WORK_CHANNEL) {
        llog.cyan(`handling message because ${message.channel} is the summer work channel`);
        const workBotResult = await ({ client, message });
    } 
    
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

