const OpenAI = require("openai");
const llog = require("learninglab-log")
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require("fs");




  


module.exports = async function ({client, event, say}) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });


    let start = new Date().getTime(); // Get current time in milliseconds
    let firstResult = await say("working on it...")

    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What’s in this image?" },
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




    let filePath = options.filePath; // Assuming you pass the file path in the options

    // 1. Check file extension
    if (!/\.(mov|MOV|mp4|m4v)$/.test(filePath)) {
        throw new Error("Unsupported file format");
    }

    // 2. Convert video file to audio-only using ffmpeg
    let outputFilePath = path.join(
        path.dirname(filePath),
        path.basename(filePath, path.extname(filePath)) + ".m4a"
    );

    let result = spawnSync('ffmpeg', ['-i', filePath, '-vn', '-b:a', '48k', outputFilePath]);
    if (result.error) {
        throw result.error;
    }


    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(outputFilePath),
        model: "whisper-1",
    });
    
    console.log(transcription.text);

    // Save the transcription to .json and .txt
    let baseNameWithoutExtension = path.basename(filePath, path.extname(filePath));
    let transcriptionJsonPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".json");
    let transcriptionTxtPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".txt");

    fs.writeFileSync(transcriptionJsonPath, JSON.stringify(transcription, null, 4));
    fs.writeFileSync(transcriptionTxtPath, transcription.text);

    let stop = new Date().getTime();
    let durationInMilliseconds = stop - start; 
    console.log(`Request took ${durationInMilliseconds} milliseconds`);

    return ({ status: "complete" });
}



const { yellow, grey, red, cyan, blue, magenta, divider } = require("../utilities/mk-utilities")
const airtableTools = require('../utilities/airtable-tools')
const makeGif = require('../make-gif')

module.exports = async ({ message, client, say }) => {
    magenta(`handling post in show-your-work`)
    // say(`we'll show that, ${message.user}`)
    // yellow(message)
    try {
        if (message.files) {
            magenta(`handling attachment`)
            var publicResult
            if (["mp4", "mov"].includes(message.files[0].filetype)) {
                // if (message.files[0].size < 50000000) {
                //     const gifResult = await makeGif({
                //         file: message.files[0],
                //         client: client,
                //     })
                //     magenta(gifResult)
                // }
                yellow(`got a movie, not doing anything about that right now`)
                blue(message)
            } else {
                try {
                    publicResult = await client.files.sharedPublicURL({
                        token: process.env.SLACK_USER_TOKEN,
                        file: message.files[0].id,
                    });
        
                    const theRecord = {
                        baseId: process.env.AIRTABLE_SHOW_BASE,
                        table: "ShowYourImages",
                        record: {
                            "Id": `${message.files[0].name}-${message.event_ts}`,
                            "Title": message.files[0].title,
                            "FileName": message.files[0].name,
                            "SlackFileInfoJson": JSON.stringify(message.files[0], null, 4),
                            // "SlackFileInfoJSON": JSON.stringify(fileInfo, null, 4),
                            "ImageFiles": [
                                {
                                "url": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)
                                }
                            ],
                            "SlackUrl": makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public),
                            "PostedBySlackUser": message.files[0].user,
                            "SlackTs": message.event_ts
                        }
                    }
                    magenta(divider)
                    cyan(theRecord)
                    const airtableResult = await airtableTools.addRecord(theRecord) 
        
                    const mdPostResult = await client.chat.postMessage({
                        channel: message.channel,
                        thread_ts: message.ts,
                        unfurl_media: false,
                        unfurl_links: false,
                        parse: "none",
                        text: `here's the markdown for embedding the image: \n\`\`\`![alt text](${makeSlackImageURL(message.files[0].permalink, message.files[0].permalink_public)})\`\`\``
                    })
                } catch (error) {
                    console.log(error)
                }
                
            }
        }
    } catch (error) {
        red(error)
    }
    
}


function makeSlackImageURL (permalink, permalink_public) {
    let secrets = (permalink_public.split("slack-files.com/")[1]).split("-")
    let suffix = permalink.split("/")[(permalink.split("/").length - 1)]
    let filePath = `https://files.slack.com/files-pri/${secrets[0]}-${secrets[1]}/${suffix}?pub_secret=${secrets[2]}`
    return filePath
}
  