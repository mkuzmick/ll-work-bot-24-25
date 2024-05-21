const at = require('../../../utils/ll-airtable-tools/index.js')
const { magenta, gray, darkgray, yellow, blue, divider, red } = require('learninglab-log')

module.exports = async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission request
    ack();
    red(divider, divider, "task_submission", divider, divider)
    blue(divider, "view", view)
    darkgray(divider, "body", body)
    const title = view['state']['values']['task_title']['plain_text_input-task']['value'] || "No Title";
    const assignedToSlackIds = view['state']['values']['assigned_to']['multi_users_select-task']['selected_users'] || null;
    const assignedToAirtableUsers = []
    // const availableForSlackChannels = view['state']['values']['available_for']['AvailableFor']['selected_conversations'] || null;
    // const availableForAirtableUsers = []
    for (let i = 0; i < assignedToSlackIds.length; i++) {
      yellow("working on user", assignedToSlackIds[i])
      const slackId = assignedToSlackIds[i];
      try {
        const personResult = await at.findOneByValue({
          baseId: process.env.AIRTABLE_WORK_BASE,
          table: "SlackUsers",
          field: "SlackUserId",
          view: "MAIN",
          value: slackId
        });
        yellow("person result", personResult)
        // change this
        assignedToAirtableUsers.push(personResult.fields.Workers[0]);
      } catch (error) {
        red(divider, `${slackId} is not yet a User in the WorkBase`, divider)
      }
    }

    const assignedByAirtableUsers = []
    try {
      const assignedByResult = await at.findOneByValue({
        baseId: process.env.AIRTABLE_WORK_BASE,
        table: "SlackUsers",
        field: "SlackUserId",
        view: "MAIN",
        value: body.user.id
      })
      // change this?
      assignedByAirtableUsers.push(assignedByResult.fields.Workers[0])
    } catch (error) {
      red(error)
    }
    const notes = view['state']['values']['task_description']['plain_text_input-task']['value'];
    const temporalStatus = view['state']['values']['task_temporalStatus']['radio_buttons-task']['selected_option']['value'];
    const taskRecord = {
      Title: title,
      AssignedTo: assignedToAirtableUsers,
      TemporalStatus: temporalStatus,
      Notes: notes
    }
    if (assignedByAirtableUsers) {
      taskRecord.AssignedBy = assignedByAirtableUsers
    }
    
    magenta("taskRecord:", taskRecord)
    try {
      const airtableResult = await at.addRecord({
        baseId: process.env.AIRTABLE_WORK_BASE,
        table: "Tasks",
        record: taskRecord
      })
      yellow(`saved to airtable`, airtableResult)
    } catch (error) {
      red(
        divider,
        "error saving to airtable",
        error,
        divider
      )
    }
}
