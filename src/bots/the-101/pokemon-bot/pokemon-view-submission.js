const llog = require('learninglab-log')
const OpenAI = require("openai");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const downloadFileFromUrl = require('../../utils/ll-utilities/download-file-from-url.js');
const pokemonBotIcon = "https://files.slack.com/files-pri/T0HTW3H0V-F069XBVK6GP/elle.l.studio_pikachu_on_a_white_background_9c17635e-ea6e-47af-a191-95af2681a39d.jpg?pub_secret=27b8f2167e"
const { pokemonImageGenerator, pokemonDescriptionFromImage, pokemonImageToSlack, pokemonStructuredData } = require('./index.js');
const at = require('../../utils/ll-airtable-tools/index.js');

module.exports = async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission request
    await ack();
    llog.gray(llog.divider, "pokemon view submission", view);
    llog.gray(llog.divider, "pokemon view submission body", body);
    try {
        llog.cyan(`please generate an image of a pokemon character called ${view.state.values.pokemon_name.pokemon_text_input_name.value} on a white background that matches the following user prompt: ${view.state.values.pokemon_description.pokemon_text_input_description.value}`)
        let image = await pokemonImageGenerator(`please generate an image of a pokemon-like character called ${view.state.values.pokemon_name.pokemon_text_input_name.value} on a white background that matches the following user prompt: ${view.state.values.pokemon_description.pokemon_text_input_description.value}.`);
        llog.magenta("image:", image);
        let filePath = `${ROOT_DIR}/_temp/openai-image-${Date.now()}.png`
        llog.blue(filePath);
        let description = await pokemonDescriptionFromImage({ image_url: image.imageUrl});
        llog.green("description returned:", description);
        await downloadFileFromUrl({fileUrl: image.imageUrl, filePath: filePath});
        let uploadResult = await pokemonImageToSlack(filePath, process.env.SLACK_POKEMON_CHANNEL, client, image.openAiResult.data[0].revised_prompt);
        llog.magenta(uploadResult);
        let slackResult;
        if (uploadResult.file.shares.private && uploadResult.file.shares.private[process.env.SLACK_POKEMON_CHANNEL]) {
            slackResult = await client.chat.postMessage({
                channel: process.env.SLACK_POKEMON_CHANNEL,
                thread_ts: uploadResult.file.shares.private[process.env.SLACK_POKEMON_CHANNEL][0].ts,
                text: `description: ${description}`,
                icon_url: pokemonBotIcon,
                username: "Pokemon Bot"
            })
        } else if (uploadResult.file.shares.public && uploadResult.file.shares.public[process.env.SLACK_POKEMON_CHANNEL]) {
            slackResult = await client.chat.postMessage({
                channel: process.env.SLACK_POKEMON_CHANNEL,
                thread_ts: uploadResult.file.shares.public[process.env.SLACK_POKEMON_CHANNEL][0].ts,
                text: `description: ${description}`,
                icon_url: pokemonBotIcon,
                username: "Pokemon Bot"
            })
        } else {
            throw new Error("could not find thread_ts");
        }
        let structuredData = await pokemonStructuredData({
            name: view.state.values.pokemon_name.pokemon_text_input_name.value,
            description: description,
            image_url: image.imageUrl,
            // revised_prompt: image.openAiResult.data[0].revised_prompt,
        });
        llog.cyan("pokemon structured data:", structuredData);
        llog.magenta("pokemon structured data:", structuredData);
        // delete temp file
        llog.white('looking for data', structuredData.choices[0].message.tool_calls[0].function.arguments);
        let pokemonRecordData = JSON.parse(structuredData.choices[0].message.tool_calls[0].function.arguments);
        llog.yellow(pokemonRecordData)
        let pokemonRecord = {
            Name: pokemonRecordData.name,
            Description: pokemonRecordData.description,
            SpriteImage: [{ url: image.imageUrl }],
            Weight: pokemonRecordData.weight,
            Height: pokemonRecordData.height,
            // RevisedPrompt: pokemonRecordData.revised_prompt,
            // BaseExperience: pokemonRecordData.base_experience,
            Moves: pokemonRecordData.moves,
            Abilities: pokemonRecordData.abilities,
            Type: pokemonRecordData.pokemon_type,
            "Special Attack": pokemonRecordData.special_attack,
        }
        let airtableResult = await at.addRecord({
            table: 'Pokemon',
            baseId: process.env.AIRTABLE_EXPERIMENTAL_BASE,
            record: pokemonRecord
        })
        llog.cyan("airtable result:", airtableResult);
        
        fs.unlinkSync(filePath);

        // add record to airtable
    } catch (error) {
        llog.red(error)
        throw error;
    }

}



