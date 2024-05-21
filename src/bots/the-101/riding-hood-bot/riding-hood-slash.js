const OpenAI = require("openai");
const llog = require("learninglab-log");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ridingHoodBotIcon =
  "https://files.slack.com/files-pri/T0HTW3H0V-F06MGEMQT1C/openai-image-1709499491277-002-red-sq.jpg?pub_secret=43241105e3";
const pantoneColors = require("../../../utils/ll-color-tools/pantone-colors-fixed.json");

function findColorFromText(text) {
  const lowerCase = text.toLowerCase();
  const foundColors = pantoneColors.filter(
    (color) =>
      color.Name.toLowerCase() === lowerCase ||
      color.Slug.toLowerCase() === lowerCase,
  );
  if (foundColors.length > 0) {
    return foundColors[0];
  } else {
    return false;
  }
}

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

module.exports = async ({ command, ack, client, say }) => {
  ack();
  llog.cyan(command);
  try {
    const color = findColorFromText(command.text);
    if (color) {
      let sayResult = await say(
        `handling this color: \n${JSON.stringify(color, null, 4)}`,
      );
      const image_url = await generateImage(
        `generate the image of the little red riding hood character, but in a world where her color is called ${color.Name}. The hex code for this color is ${color.HexCode} and its RGB value is [${color.R}, ${color.G},${color.B}]. Please create an image of this Little ${color.Name} Riding Hood, and make sure that the Wolf is lurking in the image, somewhat hidden or even almost completely obscured.`,
      );
      const tempFileLocation = `${ROOT_DIR}/_output/openai-image-${Date.now()}.png`;
      let downloadResult = await downloadImage({
        tempFileLocation: tempFileLocation,
        imageUrl: imageResult.image_url,
      });
      try {
        const uploadResult = await uploadFileToSlack({
          client,
          filePath,
          channel,
          initialComment,
          title,
        });
      } catch {}
    } else {
      let sayResult = await say(`sorry--don't have that color in the DB`);
    }

    // llog.magenta("got a /imagine request:", command);
    // let imageResult = await generateImage(command.text);

    // // let's see if we are on that channel first, if not, let's DM it to the user
    // let uploadResult = await uploadFileToSlack({
    //   client: client,
    //   channel: command.channel_id,
    //   initialComment: `for debugging, here is the openai response: \n\`\`\`${JSON.stringify(imageResult, null, 4)}\`\`\``,
    //   filePath: tempFileLocation,
    //   title: `Imagined a new image for you...`,
    // });
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

// function colorDistance(rgb1, rgb2) {
//     let rDiff = rgb1.R - rgb2.R;
//     let gDiff = rgb1.G - rgb2.G;
//     let bDiff = rgb1.B - rgb2.B;
//     return Math.sqrt(rDiff ** 2 + gDiff ** 2 + bDiff ** 2);
// }

// function findColorByRGB(r, g, b) {
//   let closestColor = null;
//   let minDistance = Number.MAX_VALUE; // Start with the highest possible value
//   pantoneColors.forEach(pantoneColor => {
//       let distance = colorDistance({}, pantoneColor);
//       if (distance < minDistance) {
//           closestColor = pantoneColor;
//           minDistance = distance;
//       }
//   });

//   return closestColor;
// }

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
      icon_url: ridingHoodBotIcon,
      username: "Riding Hood Bot",
    });
    llog.blue(result);
    return result;
  } catch (error) {
    return error;
  }
};
