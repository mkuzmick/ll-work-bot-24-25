const OpenAI = require("openai");
const llog = require("learninglab-log");
const at = require("../../utils/ll-airtable-tools/index.js");
const {
  magenta,
  gray,
  darkgray,
  yellow,
  blue,
  divider,
  red,
} = require("learninglab-log");

const taskHandler = async ({ data, slackId }) => {
  red(divider, divider, "taskHandler request", divider, divider);
  blue(data);
  const assignedToAirtableUsers = [];
  // handle multiple users later
  // try {
  //   const personResult = await at.findOneByValue({
  //     baseId: process.env.AIRTABLE_WORK_BASE,
  //     table: "SlackUsers",
  //     field: "SlackUserId",
  //     view: "MAIN",
  //     value: slackId,
  //   });
  //   yellow("person result", personResult);
  //   // change this
  //   assignedToAirtableUsers.push(personResult.fields.Workers[0]);
  // } catch (error) {
  //   red(divider, `${slackId} is not yet a User in the WorkBase`, divider);
  // }
  const taskRecord = {
    Title: data.Title,
    AssignedTo: [process.env.MK_AIRTABLE_ID],
    TemporalStatus: data.TemporalStatus,
    Notes: data.Notes,
  };
  magenta("taskRecord:", taskRecord);
  try {
    const airtableResult = await at.addRecord({
      baseId: process.env.AIRTABLE_WORK_BASE,
      table: "Tasks",
      record: taskRecord,
    });
    yellow(`saved to airtable`, airtableResult);
    return airtableResult;
  } catch (error) {
    red(divider, "error saving to airtable", error, divider);
  }
};

module.exports = async ({ client, message }) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openAiResult = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Here is text typed as a note into a Slack that logs a specific user's ideas over the course of the day. The links they've found, the writing ideas they have, and ideas for tasks they might need to do or that they may delegate to others. I need you to help determine if it is indeed a task or reminder request, and, if so, to help format the response. Err on the side of finding a task somewhere. If it is a link with any additional text at all, assume that the user wants the task to be to research use or buy whatever is at that link (if this link is to a page that sells something). Here is the message text: ${message.text} .`,
            },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "if_is_task_format_task_record",
            description:
              "If there is a task articulated somewhere in the text, this function will save a formatted record to Airtable with a Title, a Notes field, and a Temporal Priority field that defines whether this is for today, this week, next week, next month, or next term.",
            parameters: {
              type: "object",
              properties: {
                is_task: {
                  type: "boolean",
                  description:
                    "returns True if the message can be turned into a task with description, false if not.",
                },
                Title: {
                  type: "string",
                  description:
                    "The title of the task--should be 5 words or less but should summarize the task. If the text of the message was a url, the user probably wants to research what is at the link or buy what is at the link if the link is from amazon or another vendor",
                },
                Notes: {
                  type: "string",
                  description:
                    "A cleaned up and potentially expanded description of the task in nicely formatted markdown.",
                },
                TemporalStatus: {
                  type: "string",
                  enum: [
                    "EachDay",
                    "EachWeek",
                    "EachTerm",
                    "Someday",
                    "NextTerm",
                    "ThisTerm",
                    "ThisMonth",
                    "ThisWeek",
                    "Tomorrow",
                    "Today",
                    "Now",
                  ],
                  description:
                    "When the task should be done, chosen from a specific list of options. Sometimes this is a recurring task for each day or week; sometimes it is for today or tomorrow or just someday whenever. If you are unsure--if it is entirely unspecified--just go with Today.",
                },
              },
              required: ["is_task", "Title", "Notes", "TemporalStatus"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "if_is_task_format_task_record" },
      },
      max_tokens: 5000,
    });
    llog.magenta("structured data result", openAiResult);
    if (
      openAiResult.choices[0].message.tool_calls &&
      openAiResult.choices[0].message.tool_calls[0].function.name ==
        "if_is_task_format_task_record"
    ) {
      const function_arguments = JSON.parse(
        openAiResult.choices[0].message.tool_calls[0].function.arguments,
      );
      llog.yellow(function_arguments);
      if (function_arguments.is_task == true) {
        const handleTaskToolResult = await taskHandler({
          data: function_arguments,
          slackId: message.user,
        });
        llog.cyan(handleTaskToolResult);

        const slackResult = await client.chat.postMessage({
          channel: message.channel,
          thread_ts: message.ts,
          text: `created a task for you: ${description}`,
          // icon_url: pokemonBotIcon,
          // username: "Pokemon Bot"
        });
      } else {
        llog.red("function called and determined not to be task");
      }
    } else {
      llog.red("no task function called");
    }
  } catch (error) {
    llog.red(`failed with function call attempt and message ${message}`);
    llog.red(error.message);
    return error;
  }
};
