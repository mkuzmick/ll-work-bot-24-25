const llog = require('learninglab-log');
const pokemonFormView = require('./pokemon-form-view');

module.exports = async ({ command, ack, say, client }) => {
    ack();
    llog.magenta(llog.divider, "got a pokemon slash request")
    llog.gray(JSON.stringify(command, null, 4));
    try {
        const theView = await pokemonFormView({
            user: command.user_id, 
            trigger_id: command.trigger_id,
            commandText: command.text
        })
        try {
            const result = await client.views.open(theView);
        } catch (error) {
            red(error)
        }
    } catch (error) {
        llog.red(error)
    }
}

