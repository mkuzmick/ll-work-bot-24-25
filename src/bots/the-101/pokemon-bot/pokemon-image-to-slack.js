const fs = require('fs');
const path = require('path');
const llog = require('learninglab-log');

module.exports = async (fileName, channelId, client, newPrompt) => {
    llog.blue('uploading', fileName, channelId, newPrompt)
    try {
        // Call the files.upload method using the WebClient
        const result = await client.files.upload({
        // const result = await client.files.uploadV2({
            // channels can be a list of one to many strings
            channels: channelId,
            // channel_id: channelId,
            fileName: path.basename(fileName),
            // filetype: "png",
            title: "your image",
            initial_comment: `OpenAI made your image, but the prompt was changed to "${newPrompt}"`,
            // Include your filename in a ReadStream here
            file: fs.createReadStream(fileName),
        });

        llog.blue(result);
        return result;
    } catch (error) {
        console.error(error);
    }
    return result
};

