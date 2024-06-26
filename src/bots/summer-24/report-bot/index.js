const OpenAI = require("openai");
const llog = require("learninglab-log");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const reportBotIcon =
  "https://files.slack.com/files-pri/T0HTW3H0V-F06980PK5S8/guy-tiled.jpg?pub_secret=347a4fe478";

const generateImage = async (text) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openaiResult = await openai.images.generate({
      model: "dall-e-3",
      prompt: text,
      n: 1,
      size: "1024x1024",
      // size: "1024x1792",
      quality: "hd",
    });
    llog.yellow(openaiResult);
    return {
      open_ai_response: openaiResult,
      image_url: openaiResult.data[0].url,
    };
  } catch (error) {
    llog.red(error);
    return error;
  }
};

const downloadImage = async ({ tempFileLocation, imageUrl }) => {
  const response = await axios({
    url: imageUrl,
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(tempFileLocation))
      .on("finish", () => resolve("success!"))
      .on("error", (e) => reject(e));
  });
};

const uploadFileToSlack = async ({
  client,
  filePath,
  channel,
  initialComment,
  title,
}) => {
  llog.blue(`uploading file to slack: ${filePath}`);
  try {
    const result = await client.files.upload({
      channels: channel,
      filename: path.basename(filePath),
      title: title,
      initial_comment: initialComment,
      file: fs.createReadStream(filePath),
      icon_url: reportBotIcon,
      username: "Summer Report Bot",
    });
    llog.blue(result);
    return result;
  } catch (error) {
    llog.red(error);
    return error;
  }
};

const getReportOnMessages = async (messages) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  llog.blue("trying with", messages);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content:
          "Please help me generate a brief report on what took place today at our education, media and design studio based on this series of slack messages.",
      },
      {
        role: "assistant",
        content:
          "No problem, please send me the message in JSON and I will be happy to do my best",
      },
      { role: "user", content: JSON.stringify(messages) },
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0]);

  return completion.choices[0];
};

module.exports = async ({ command, client }) => {
  // ack();
  try {
    // let sayResult = await say("working on that report...");
    llog.magenta("got a /s24 report request:", command);
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

    const result = await client.conversations.history({
      channel: command.channel_id,
      oldest: twentyFourHoursAgo,
    });

    if (result.ok) {
      llog.yellow(result.messages);

      const reportFromAI = await getReportOnMessages(result.messages);
      llog.blue("reportFromAI", reportFromAI);

      let imageResult = await generateImage(
        `please create a hero image to accompany this report: ${reportFromAI.message.content}`,
      );
      const tempFileLocation = `${ROOT_DIR}/_output/openai-image-${Date.now()}.png`;
      let downloadResult = await downloadImage({
        tempFileLocation: tempFileLocation,
        imageUrl: imageResult.image_url,
      });
      let uploadResult = await uploadFileToSlack({
        client: client,
        channel: command.channel_id,
        initialComment: reportFromAI.message.content,
        filePath: tempFileLocation,
        title: `What happened in the past 24 hours`,
      });
    } else {
      throw new Error("Error fetching conversation history");
    }

    // // let's see if we are on that channel first, if not, let's DM it to the user

    // llog.magenta(`image uploaded`);
    // llog.magenta(uploadResult);
    // fs.unlink(tempFileLocation, (err) => {
    //   if (err) {
    //     console.error("Error deleting the temporary file:", err);
    //   } else {
    //     console.log("Temporary file deleted successfully.");
    //   }
    // });
  } catch (error) {
    console.error(error);
    return error;
  }
};

// let secondSlackMessage = await client.chat.postMessage({
//     channel: command.channel_id,
//     text: `here is your link: ${imageResult.image_url}`
// })
