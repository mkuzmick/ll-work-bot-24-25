const llog = require('learninglab-log')

const ensemble = require('./ensemble')

module.exports.respondToMessage = async ({ message, client, say }) => {
    for (let i = 0; i < ensemble.length; i++) {
        let bot = ensemble[i]
        llog.yellow("testing", bot.name)
        if (bot.trigger == "file") {
            llog.cyan("bot trigger is file?", bot)
            try {
                if (bot.channel_ids.includes(message.channel) && message.files) {
                    await bot.function({ client, message, say })
                }
                // return
            } catch (error) {
                console.error(error)
            }

        } else if (bot.trigger == "name") {
            llog.yellow("testing", bot.name)

            if (message.text.toLowerCase().includes(bot.name.toLowerCase())) {
                // Your code here
                llog.magenta(message.text.toLowerCase(), bot.name.toLowerCase())
                if (bot.channel_ids.includes(message.channel)) {
                    await bot.function({ client, message, say })
                }
            } 
            // return
        }
    }

}

module.exports.respondToEvent = async ( {event }) => {

}