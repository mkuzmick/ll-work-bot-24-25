const OpenAI = require("openai");
const llog = require("learninglab-log");

module.exports = async (prompt) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });
        const openAiResult = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            // size: "1024x1792",
            quality: "hd",
            size: "1024x1024",
        });
        llog.yellow(openAiResult)
        return({
            imageUrl: openAiResult.data[0].url,
            openAiResult: openAiResult
        })
    } catch (error) {
        llog.red(error)
    }
}
