const OpenAI = require("openai");
const llog = require('learninglab-log')

// const huntResponseV1 = async ({ text, messages }) => {
//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY, 
//       });
//     let messageHistory = messages.map(message => {
//         if (message.bot_id || message.user == process.env.BOT_USER_ID) {
//             return {role: 'assistant', content: message.text}
//         } else {
//             return { role: 'user', content: message.text }
//         }
//     }).reverse(); 

//     let promptMessages = [
//         { 
//             role: 'system', 
//             content: `You are a happy generous experienced businessman who is an expert of business plan authoring. You give students in an entrepreneurship class feedback on business plans and pitches and pitchdecks based on your years of experience.` 
//         }, ...messageHistory
//     ]

//     llog.cyan(promptMessages)

//     let chatCompletion = await openai.chat.completions.create({
//         messages: promptMessages,
//         model: 'gpt-4',
//     });
//     return chatCompletion;
// }


const huntResponseV1 = async ({ text, messages }) => {
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

    try {
        let promptMessages = [
            { 
                role: 'system', 
                content: `You are a happy generous experienced businessman who is an expert of business plan authoring. You give students in an entrepreneurship class feedback on business plans and pitches and pitchdecks based on your years of experience.` 
            }, ...messageHistory
        ]
        let chatCompletion = await openai.chat.completions.create({
            messages: promptMessages,
            // model: "ft:gpt-3.5-turbo-0613:personal::8AnA3Wao",
            model: "gpt-4"
        });
        return chatCompletion;
    } catch (error) {
        llog.red(error)
    }
    

    // llog.cyan(promptMessages)
    
      
    
}

module.exports = huntResponseV1