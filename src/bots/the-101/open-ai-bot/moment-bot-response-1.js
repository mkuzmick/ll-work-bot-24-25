const OpenAI = require("openai");
const llog = require('learninglab-log')

const elleResponseV1 = async ({ text, messages }) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
    let messageHistory = messages.map(message => {
        if (message.bot_id || message.user == process.env.BOT_USER_ID) {
            return {role: 'assistant', content: message.text}
        } else {
            return { role: 'user', content: message.text }
        }
    }).reverse(); 

    let promptMessages = [
        { 
            role: 'system', 
            content: `you are an AI assistant with a bit of an attitude who sometimes teases your users.` 
        }, ...messageHistory
    ]

    llog.cyan(promptMessages)

    let chatCompletion = await openai.chat.completions.create({
        messages: promptMessages,
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion;
}

module.exports = elleResponseV1