var chokidar = require('chokidar');
const llog = require('learninglab-log')
const path = require('path')
const OpenAI = require("openai");
const { spawnSync } = require('child_process');
const fs = require("fs");
const airtableTools = require('../../../utils/ll-airtable-tools')

const everyminuteBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F067VR9KJCE/every-minute-bot.jpg?pub_secret=964e623d94"

function timestamp() {
    const now = new Date();
    return now.getFullYear().toString() +
           (now.getMonth() + 1).toString().padStart(2, '0') +
           now.getDate().toString().padStart(2, '0') + ' ' +
           now.getHours().toString().padStart(2, '0') +
           now.getMinutes().toString().padStart(2, '0') +
           now.getSeconds().toString().padStart(2, '0') + '.' +
           now.getMilliseconds().toString().padStart(3, '0');
}
  
function extractDateTimeFromPath(path) {
    const match = path.match(/(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.mov$/);
    
    if (match) {
        const [year, month, day, hour, minute, second] = match[1].split('-').map(Number);
        // Note: month in JavaScript is 0-based (0 = January, 11 = December)
        return new Date(year, month - 1, day, hour, minute, second);
    }
    return null;
}

function hasTimeElapsed(path, timeInMilliseconds) {
    const fileDateTime = extractDateTimeFromPath(path);
    
    if (fileDateTime) {
        const currentTime = new Date();
        const elapsedTime = currentTime - fileDateTime;

        return elapsedTime > timeInMilliseconds;
    }
    return false;
}

const transcribeFile = async function (options) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });
    let start = new Date().getTime(); // Get current time in milliseconds
    let filePath = options.filePath; // Assuming you pass the file path in the options
    // 1. Check file extension
    if (!/\.(mov|MOV|mp4|m4v|aac|wav|WAV|mp3)$/.test(filePath)) {
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

    return ({ text: transcription.text });
}

const everyMinuteAction = async ({client}) => {
    llog.blue("everyMinuteBot is live")
    var watcher = chokidar.watch(process.env.OBS_CAPTURE_FOLDER, {
        ignored: /\.DS_Store/, 
        persistent: true, 
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 200
          },
    });
    watcher
        .on('add', async function(file) {
            console.log('File', file, 'has been added');
            if (path.extname(file) == ".mov") {
                llog.yellow(`${file} is a movie and was added at ${timestamp()}`);
                
            } else {
                console.log(`some other file: ${file}`)
            }
        })
        .on('change', async function(file) {
            if (path.extname(file) == ".mov") {
                llog.yellow(file, `is a movie and just changed at ${timestamp()}`)
                
        
                if (hasTimeElapsed(file, (1 * 60) * 1000)) { // 1 minute and 10 seconds in milliseconds
                    console.log(`More than 1 minute has elapsed since the video timestamp.`);
                    console.log('File', file, 'has been changed, about to transcribe');
                    const transcriptionResult = await transcribeFile({ filePath: file })
                    llog.magenta(transcriptionResult)
                    llog.blue(transcriptionResult.text)
                    // const frenchResult = await frenchResponse(transcriptionResult.text)
                    // const slackResult = await client.chat.postMessage({
                    //     channel: process.env.SLACK_EVERY_MINUTE_IN_FRENCH_CHANNEL,
                    //     text: frenchResult.choices[0].message.content
                    // })
                    const slackEveryMinuteChannelResult = await client.chat.postMessage({
                        channel: process.env.SLACK_EVERY_MINUTE_CHANNEL,
                        text: transcriptionResult.text ? transcriptionResult.text : "nothing happening right now",
                        icon_url: everyminuteBotIcon,
                        username: "Every Minute Bot"
                    })
                    // const airtableResult = await minuteToAirtable({
                    //     slackData: slackEveryMinuteChannelResult,
                    //     openAiData: transcriptionResult
                    // })


                } else {
                    console.log('Less than 1 minute has elapsed since the video timestamp.');
                }

                
            } else {
                console.log(`some other file changed: ${file}`)
            }
            
        })
        .on('unlink', function(file) {console.log('File', file, 'has been removed');})
        .on('error', function(error) {console.error('Error happened', error);})
}

module.exports.everyMinuteAction = everyMinuteAction

const minuteToAirtable = async ({ slackData, openAiData }) => {
    let theRecord = {
        SlackTs: message.ts,
        Text: message.text || "",
        UserId: message.user,
        SlackChannel: message.channel,
        SlackJSON: JSON.stringify(message, null, 4)
    }
    let theResult = await airtableTools.addRecord({
        baseId: process.env.AIRTABLE_MOMENTS_BASE,
        table: "SlackMessages",
        record: theRecord
    })
    return(theResult)
}