const reportBot = require("../report-bot/index.js");

module.exports.handleS24Slash = async ({ command, ack, client, say }) => {
  ack();
  if (command.text == "report") {
    await reportBot({ command, client });
  } else {
    await say(
      `sorry, not handling that yet. You can try typing "report" for a result.`,
    );
  }
};
