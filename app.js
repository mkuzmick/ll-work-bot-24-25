const { App } = require("@slack/bolt");
var path = require("path");
var fs = require("fs");
const llog = require("learninglab-log");
const bots = require("./src/bots/index.js");
const handleMessages = require("./src/handlers/message-handler");
const handleEvents = require("./src/handlers/event-handler.js");
const { noBotMessages } = require("./src/utils/ll-slack-tools/middleware");
const getAirtableConfig = require("./src/bots/summer-24/config-bot/get-airtable-config.js");
const { handleS24Slash } = require("./src/bots/summer-24/s24-director-bot");
global.ROOT_DIR = path.resolve(__dirname);

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.command("/s24", handleS24Slash);
// app.view(/task_submission/, bots.taskBot.viewSubmission);

app.message("testing testing", handleMessages.testing);
app.message(/.*/, handleMessages.parseAll);

app.event("reaction_added", handleEvents.reactionAdded);
app.event("reaction_removed", handleEvents.reactionRemoved);

(async () => {
  const channelConfig = await getAirtableConfig({
    baseId: process.env.AIRTABLE_WORK_BASE,
    table: "ChannelConfig",
  });
  llog.yellow(channelConfig);
  global.BOT_CONFIG = {
    channelConfig: channelConfig,
  };
  // Check for folders
  if (!fs.existsSync("_temp")) {
    fs.mkdirSync("_temp");
  }
  if (!fs.existsSync("_output")) {
    fs.mkdirSync("_output");
  }
  await app.start(process.env.PORT || 3000);
  llog.yellow("⚡️ Bolt app is running!");
  let slackResult = await app.client.chat.postMessage({
    channel: process.env.SLACK_LOGGING_CHANNEL,
    text: "starting up the summer work bots",
  });
  // let logTest = await bots.loggingBot.logToSlack({
  //   client: app.client,
  //   text: "testing logging bot",
  // });
})();
