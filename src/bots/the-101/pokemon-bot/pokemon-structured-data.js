const OpenAI = require('openai');
const llog = require('learninglab-log');

module.exports = async ({ name, description, image_url }) => { 
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, 
        });
        const assistantId = process.env.OPENAI_POKEMON_ASSISTANT_ID;
        const openAiResult = await openai.chat.completions.create(
            {
                model: "gpt-4",
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": `Help me create statistics for this imaginary character based on its name and description.  The description is as follows: ${description}. The name is ${name}. And note that the url for this character is ${image_url}. Please use the create_pokemon function to accomplish this.`
                            },
                        ],
                    }
                ],
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "create_pokemon_record",
                            description: "Create a new pokemon record from a name, description and image, with a strict data structure",
                            parameters: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "The name of the Pokemon",
                                    },
                                    description: {
                                        type: "string",
                                        description: "New short description of the Pokemon of the sort that you would see on a Pokemon card"
                                    },
                                    image_url: {
                                        type: "string",
                                        description: "URL of the image of the Pokemon",
                                    },
                                    weight: {
                                        type: "integer",
                                        description: "Weight of the Pokemon in kilograms between 0 and 50000",
                                    },
                                    height: {
                                        type: "integer",
                                        description: "Height of the Pokemon in meters between 0 and 100",
                                    },
                                    base_experience: {
                                        type: "integer",
                                        description: "base_experience of the Pokemon",
                                    },
                                    hp: {
                                        type: "integer",
                                        description: "HP of the Pokemon",
                                    },
                                    attack: {
                                        type: "integer",
                                        description: "attack value of the Pokemon",
                                    },
                                    defense: {
                                        type: "integer",
                                        description: "defense value of the Pokemon",
                                    },
                                    special_attack: {
                                        type: "integer",
                                        description: "special attack value of the Pokemon",
                                    },
                                    special_defense: {
                                        type: "integer",
                                        description: "special defense value of the Pokemon",
                                    },
                                    moves: {
                                        type: "string",
                                        description: "the moves of this pokemon",
                                    },
                                    abilities: {
                                        type: "string",
                                        description: "the abilities of the Pokemon",
                                    },
                                    pokemon_type: {
                                        type: "string",
                                        "description": "The type of Pokemon",
                                    }
                                },
                                required: ["name", "description", "image_url", "weight", "height", "moves", "abilities", "hp", "revised_prompt"],
                            },
                        }
                    }
                ],
                max_tokens: 5000,
            }
        );
        llog.magenta("structured data result", openAiResult)
        return(openAiResult)
    } catch (error) {
        llog.red(`failed to create structured data for pokemon ${name}`)
        llog.red(error.message)
        return error
    }

}
