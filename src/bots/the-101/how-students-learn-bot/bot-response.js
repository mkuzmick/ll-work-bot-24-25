const OpenAI = require("openai");
const llog = require('learninglab-log')


const pollRunStatus = async (threadId, runId, interval = 3000, maxAttempts = 50) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
    let attempts = 0;

    const executePoll = async (resolve, reject) => {
        const run = await openai.beta.threads.runs.retrieve(threadId, runId); // Assuming this is how you retrieve the run status
        llog.cyan(`run status`, run.status)
        attempts++;

        if (run.status === "completed") {
            resolve(run.status); // Resolve with the completed run status
        } else if (attempts >= maxAttempts) {
            reject(new Error("Max polling attempts reached"));
        } else {
            setTimeout(executePoll, interval, resolve, reject);
        }
    };

    return new Promise(executePoll);
};



const botResponse = async ({ message, client }) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
      });
    // let messageHistory = messages.map(message => {
    //     if (message.bot_id || message.user == process.env.BOT_USER_ID) {
    //         return {role: 'assistant', content: message.text}
    //     } else {
    //         return { role: 'user', content: message.text }
    //     }
    // }).reverse(); 
    try {
        llog.magenta(message);
        llog.blue(global.BOT_CONFIG);
        const botConfig = global.BOT_CONFIG.channel_openai_configs[message.channel];
        const initialSlackResult = await client.chat.postMessage({
            channel: message.channel,
            text: "I'm thinking...",
            icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F06K19A2QEM/androgenous_cyborg_teacher.webp?pub_secret=898dff8358",
            username: "How Students Learn Bot"
        });
        llog.green(initialSlackResult)
        const theThread = await openai.beta.threads.create();
        llog.cyan(theThread);
        const threadMessage = await openai.beta.threads.messages.create(
            theThread.id,
            { role: "user", content: message.text }
        );

        
        const run = await openai.beta.threads.runs.create(
            theThread.id,
            { assistant_id: process.env.OPENAI_HSL_ASSISTANT_ID }
        );

        // Wait for the run to complete
        const completedRun = await pollRunStatus(theThread.id, run.id);

        // Once the run is complete, retrieve the latest messages from the thread
        // Assuming this is how you retrieve messages from a thread
        const threadMessages = await openai.beta.threads.messages.list(theThread.id);

        llog.cyan(threadMessages.body.data);
        // Here you would filter or select the appropriate response from `threadMessages`
        // and send it back to Slack
        const responseMessage = threadMessages.body.data[0].content[0].text.value;

        const mainSlackResult = await client.chat.postMessage({
            channel: message.channel,
            text: responseMessage,
            icon_url: "https://files.slack.com/files-pri/T0HTW3H0V-F06K19A2QEM/androgenous_cyborg_teacher.webp?pub_secret=898dff8358",
            username: "How Students Learn Bot"
        });
        

        // let commentaryResult;
        // if (uploadResult.file.shares.private && uploadResult.file.shares.private[process.env.SLACK_POKEMON_CHANNEL]) {
        //     slackResult = await client.chat.postMessage({
        //         channel:  message.channel,
        //         thread_ts: uploadResult.file.shares.private[process.env.SLACK_POKEMON_CHANNEL][0].ts,
        //         text: `description: ${description}`,
        //         icon_url: pokemonBotIcon,
        //         username: "Pokemon Bot"
        //     })
        // } else if (uploadResult.file.shares.public && uploadResult.file.shares.public[process.env.SLACK_POKEMON_CHANNEL]) {
        //     slackResult = await client.chat.postMessage({
        //         channel:  message.channel,
        //         thread_ts: uploadResult.file.shares.public[process.env.SLACK_POKEMON_CHANNEL][0].ts,
        //         text: `description: ${description}`,
        //         icon_url: pokemonBotIcon,
        //         username: "Pokemon Bot"
        //     })


        // const myThread = await openai.beta.threads.retrieve(
        //     "thread_abc123"
        //   );

          

        // const threadMessages = await openai.beta.threads.messages.list(
        //     "thread_abc123"
        // );


        // const message = await openai.beta.threads.messages.retrieve(
        //     "thread_abc123",
        //     "msg_abc123"
        //   );

          

    } catch (error) {
        console.error(error);
        llog.red(error)
    }
}

module.exports = botResponse
