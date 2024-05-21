const fs = require('fs')
const path = require('path');
const llog = require('learninglab-log')
const fetch = require('node-fetch');
const OpenAI = require('openai');
const toFile = OpenAI.toFile;

const finetune = async ({ txt }) => {

    const data = fs.readFileSync(txt, 'utf-8');

    // Split the input data into dialogue chunks
    const chunks = data.split(/\n(?=\d{2}:\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}:\d{2})/).filter(Boolean);

    llog.cyan(chunks);

    // Prepare a list to store JSON objects
    const jsonLines = [];

    // Define a default user message
    const defaultUserMessage = "I didn't say anything, but am eager to hear your thoughts about my business plan";

    // Define a function to create a JSON object for a dialogue chunk
    function createJsonObj(role, content) {
        return {
            role,
            content: content.trim() || (role === 'user' ? defaultUserMessage : ''),
        };
    }

    // Define a system message
    const systemMessage = {
        role: 'system',
        content: 'You are a happy generous experienced businessman who is an expert of business plan authoring. You give students in an entrepreneurship class feedback on business plans and pitches and pitchdecks based on your years of experience.',
    };

    let prevSpeaker = null;
    let messageBuffer = [];
    const processBuffer = (currentSpeaker) => {
        if (!messageBuffer.length) return;

        const messages = [systemMessage];
        if (prevSpeaker === 'Speaker 1') {
            messages.push(createJsonObj('user', messageBuffer.join(' ')));
            if (currentSpeaker === 'Speaker 2') {
                messages.push(createJsonObj('assistant', ''));
            }
        } else if (prevSpeaker === 'Speaker 2') {
            messages.push(createJsonObj('user', ''));
            messages.push(createJsonObj('assistant', messageBuffer.join(' ')));
        }

        jsonLines.push({ messages });
        messageBuffer = [];
    };

    for (let chunk of chunks) {
        // Extract speaker and dialogue using regex
        const match = chunk.match(/(Speaker [12])\n([\s\S]*)/);
        if (!match) continue;

        const currentSpeaker = match[1];
        const dialogue = match[2];

        if (prevSpeaker && currentSpeaker !== prevSpeaker) {
            processBuffer(currentSpeaker);
        }

        messageBuffer.push(dialogue);
        prevSpeaker = currentSpeaker;
    }

    // Ensure the last buffered messages are processed
    processBuffer();

    // Convert the list of JSON objects to JSON lines and write to a file
    const outputFileName = path.join(path.dirname(txt), path.basename(txt, '.txt') + '.jsonl');

    fs.writeFileSync(outputFileName, jsonLines.map(JSON.stringify).join('\n'));

    console.log(`JSON lines written to ${outputFileName}`);

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});



    // If you have access to Node fs we recommend using fs.createReadStream():
    let openAiFileResult = await openai.files.create({ file: fs.createReadStream(outputFileName), purpose: 'fine-tune' });

    llog.green(openAiFileResult)

}

module.exports = finetune




