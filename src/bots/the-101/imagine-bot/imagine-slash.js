const OpenAI = require("openai");
const llog = require("learninglab-log");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const imagineBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F06980PK5S8/guy-tiled.jpg?pub_secret=347a4fe478";

const generateImage = async (text) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        const openaiResult = await openai.images.generate({
            model: "dall-e-3",
            prompt: text,
            n: 1,
            size: "1024x1024",
            // size: "1024x1792",
            quality: "hd"
        })
        llog.yellow(openaiResult);
        return ({
            open_ai_response: openaiResult,
            image_url: openaiResult.data[0].url
        })
    } catch (error) {
        llog.red(error)
        return error
    }  
}

const downloadImage = async ({ tempFileLocation, imageUrl }) => {
    const response = await axios({
        url: imageUrl,
        responseType: "stream"
    })
    return new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(tempFileLocation))
            .on('finish', () => resolve("success!"))
            .on('error', e => reject(e))
    })
}

const uploadFileToSlack = async ({ client, filePath, channel, initialComment, title }) => {
    llog.blue(`uploading file to slack: ${filePath}`);
    try {
        const result = await client.files.upload({
            channels: channel,
            filename: path.basename(filePath),
            title: title,
            initial_comment: initialComment,
            file: fs.createReadStream(filePath),
            icon_url: imagineBotIcon,
            username: "Imagine Bot"
        });
        llog.blue(result);
        return result;
    } catch (error) {
        return error;
    }
}

// const uploadFileToSlack = async ({ client, filePath, channel, initialComment, title, userId }) => {
//     llog.blue(`uploading file to slack: ${filePath}`);

//     try {
//         // Check if the bot is a member of the channel
//         const channelInfo = await client.conversations.members({ channel: channel });
//         const botUserId = 'your_bot_user_id'; // Replace with your bot's user ID
//         const isBotInChannel = channelInfo.members.includes(botUserId);

//         if (!isBotInChannel) {
//             // If the bot is not in the channel, send a DM to the user
//             await client.chat.postMessage({
//                 channel: userId,
//                 text: "I'm not in the channel you specified. Please invite me to the channel and try again."
//             });
//             return { error: "Bot is not in the channel." };
//         }

//         // If the bot is in the channel, proceed with file upload
//         const result = await client.files.upload({
//             channels: channel,
//             filename: path.basename(filePath),
//             title: title,
//             initial_comment: initialComment,
//             file: fs.createReadStream(filePath),
//             icon_url: imagineBotIcon,
//             username: "Imagine Bot"
//         });
//         llog.blue(result);
//         return result;
//     } catch (error) {
//         llog.red(error);
//         return error;
//     }
// };



module.exports = async ({ command, ack, client, say }) => {
    ack();
    try {
        let sayResult = await say("working on that image...");
        llog.magenta("got a /imagine request:", command);
        let imageResult = await generateImage(command.text);
        const tempFileLocation = `${ROOT_DIR}/_output/openai-image-${Date.now()}.png`;
        let downloadResult = await downloadImage({
            tempFileLocation: tempFileLocation,
            imageUrl: imageResult.image_url
        });
        // let's see if we are on that channel first, if not, let's DM it to the user
        let uploadResult = await uploadFileToSlack({
            client: client,
            channel: command.channel_id,
            initialComment: `for debugging, here is the openai response: \n\`\`\`${JSON.stringify(imageResult, null, 4)}\`\`\``,
            filePath: tempFileLocation,
            title: `Imagined a new image for you...`
        })
        llog.magenta(`image uploaded`);
        llog.magenta(uploadResult);
        fs.unlink(tempFileLocation, (err) => {
            if (err) {
                console.error("Error deleting the temporary file:", err);
            } else {
                console.log("Temporary file deleted successfully.");
            }
        });
    } catch (error) {
        console.error(error)
        return error;
    }
}

    // let secondSlackMessage = await client.chat.postMessage({
    //     channel: command.channel_id, 
    //     text: `here is your link: ${imageResult.image_url}`
    // })