const { red, darkgray } = require('learninglab-log')
const taskView = require("./task-view.js")

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    darkgray(`user ${command.user_id} has requested a new task 1\n${JSON.stringify(command, null, 4)}`);
    try {
        const theView = await taskView({
            user: command.user_id, 
            trigger_id: command.trigger_id,
            commandText: command.text
        })
        const result = await client.views.open(theView);
        darkgray(result);
    } catch (error) {
        red(error)
        throw error;
    }
}
