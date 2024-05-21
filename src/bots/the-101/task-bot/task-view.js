
module.exports = ({ user, trigger_id, commandText }) => {    
    const theView = {
        trigger_id: trigger_id,
        view: {
          type: 'modal',
          callback_id: 'task_submission',
          title: {
            type: 'plain_text',
            text: 'New Task'
          },
          "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-task",
                    "initial_value": commandText.substring(0, 53)                },
                "label": {
                    "type": "plain_text",
                    "text": "Title",
                    "emoji": true
                },
                "block_id": "task_title"
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "plain_text_input-task",
                    "initial_value": commandText
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description",
                    "emoji": true
                },
                "block_id": "task_description"
            },
            {
                "type": "input",
                "element": {
                    "type": "radio_buttons",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "someday",
                                "emoji": true
                            },
                            "value": "Someday"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this term",
                                "emoji": true
                            },
                            "value": "ThisTerm"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this month",
                                "emoji": true
                            },
                            "value": "ThisMonth"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "this week",
                                "emoji": true
                            },
                            "value": "ThisWeek"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "tomorrow",
                                "emoji": true
                            },
                            "value": "Tomorrow"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "today",
                                "emoji": true
                            },
                            "value": "Today"
                        }
                    ],
                    "action_id": "radio_buttons-task",
                    "initial_option": {
                        "text": {
                            "type": "plain_text",
                            "text": "today",
                            "emoji": true
                        },
                        "value": "Today"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "When?",
                    "emoji": true
                },
                "block_id": "task_temporalStatus"
            },
            {
                "type": "input",
                "element": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select users",
                        "emoji": true
                    },
                    "action_id": "multi_users_select-task",
                    "initial_users": user ? [user] : []
                },
                "label": {
                    "type": "plain_text",
                    "text": "Assigned To",
                    "emoji": true
                },
                "block_id": "assigned_to"
            },
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "plain_text_input-task-tags",
                    "initial_value": "comma, separated, tags"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Tags (Beta)",
                    "emoji": true
                },
                "block_id": "task_tags"
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