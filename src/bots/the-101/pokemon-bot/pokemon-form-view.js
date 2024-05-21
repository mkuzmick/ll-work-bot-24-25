
const createView = ({ user, trigger_id, commandText }) => {    
    const theView = {
        trigger_id: trigger_id,
        view: {
          type: 'modal',
          callback_id: 'pokemon_submission',
          title: {
            type: 'plain_text',
            text: 'Pokemon Generator'
          },
          "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "pokemon_text_input_name",
                    "initial_value": commandText.substring(0, 53)                },
                "label": {
                    "type": "plain_text",
                    "text": "Name",
                    "emoji": true
                },
                "block_id": "pokemon_name"
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "pokemon_text_input_description",
                    "initial_value": commandText
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                },
                "block_id": "pokemon_description"
            }
        ],
        submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      }
      return theView
}



module.exports = createView