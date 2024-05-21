const OpenAI = require('openai');
const llog = require('learninglab-log');

module.exports = async ({ image_url, name, description, revised_prompt }) => {  
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });
        const openAiResult = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            
                            "text": `Describe this image of a collectible trading card character. Be specific about the characters physical and mental attributes, like how strong and smart it may be, as well as how tall it may be. I need all the data I'll require to create statistics for this character.`},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url,
                            },
                        },
                    ],
                }
            ],
            max_tokens: 2000,
        });
        llog.yellow("openai vision result", openAiResult)
        let description = openAiResult.choices[0].message.content
        return(description)
    } catch (error) {
        llog.red(error)
    }
}