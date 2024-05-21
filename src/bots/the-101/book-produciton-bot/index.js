const airtableTools = require(`../../ll-modules/ll-airtable-tools`);
const { llog } = require("../../ll-modules/ll-utilities");

const bookProductionBot = async function ({ event, client, fileInfo }) {
  llog.yellow(`now starting book-production-bot`);
  try {



    const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: command.text },
                {
                  type: "image_url",
                  image_url: {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                  },
                },
              ],
            },
          ],
        });
    llog.magenta(response.choices[0]);



    const messageText = await
    const mdPostResult = await client.chat.postMessage({
      channel: event.channel_id,
      text: messageText,
    });
  } catch (error) {
    console.error(error);
    llog.red(error);
  }
};

module.exports = imageBot;
