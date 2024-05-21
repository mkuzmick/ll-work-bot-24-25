const OpenAI = require("openai");
const llog = require("learninglab-log")
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require("fs");


const testMessages = [
    { 
        role: 'system',
        content: 'you are a helpful assistant'
    },
    {
        role: 'user',
        content: 'explain how to create a simple Express app'
    },

]

module.exports.transcribeFile = async function (options) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });


    let start = new Date().getTime(); // Get current time in milliseconds
    
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


// module.exports.transcribeFolder = async function (options) {


//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY, 
//     });


//     let start = new Date().getTime(); // Get current time in milliseconds
    
//     let filePath = options.filePath; // Assuming you pass the file path in the options

//     // 1. Check file extension
//     if (!/\.(mov|MOV|mp4|m4v)$/.test(filePath)) {
//         throw new Error("Unsupported file format");
//     }

//     // 2. Convert video file to audio-only using ffmpeg
//     let outputFilePath = path.join(
//         path.dirname(filePath),
//         path.basename(filePath, path.extname(filePath)) + ".m4a"
//     );

//     let result = spawnSync('ffmpeg', ['-i', filePath, '-vn', '-b:a', '196k', outputFilePath]);
//     if (result.error) {
//         throw result.error;
//     }



//     const transcription = await openai.audio.transcriptions.create({
//         file: fs.createReadStream(outputFilePath),
//         model: "whisper-1",
//     });
    
//     console.log(transcription.text);

//     // Save the transcription to .json and .txt
//     let baseNameWithoutExtension = path.basename(filePath, path.extname(filePath));
//     let transcriptionJsonPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".json");
//     let transcriptionTxtPath = path.join(path.dirname(filePath), baseNameWithoutExtension + ".txt");

//     fs.writeFileSync(transcriptionJsonPath, JSON.stringify(transcription, null, 4));
//     fs.writeFileSync(transcriptionTxtPath, transcription.text);

//     let stop = new Date().getTime();
//     let durationInMilliseconds = stop - start; 
//     console.log(`Request took ${durationInMilliseconds} milliseconds`);

//     return ({ status: "complete" });
// }

