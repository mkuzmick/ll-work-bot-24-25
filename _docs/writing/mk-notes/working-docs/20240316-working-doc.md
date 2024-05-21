## question

```javascript
const { App } = require("@slack/bolt");
var path = require("path");
var fs = require("fs");
const llog = require("learninglab-log");
const bots = require("./src/bots/index.js");
const handleMessages = require("./src/handlers/message-handler");
const handleEvents = require("./src/handlers/event-handler.js");
const { noBotMessages } = require("./src/utils/ll-slack-tools/middleware");

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

if (process.env.NODE_ENV === "production") {
  // taskbot
  app.command("/task", bots.taskBot.slash);
  app.view(/task_submission/, bots.taskBot.viewSubmission);

  // imaginebot
  app.command("/imagine", bots.imagineBot.slash);

  // pokemonbot
  app.command("/pokemon", bots.pokemonBot.slash);
  app.view(/pokemon_submission/, bots.pokemonBot.viewSubmission);

  app.message("testing testing", handleMessages.testing);
  app.message(/.*/, handleMessages.parseAllProduction);
} else if (process.env.NODE_ENV === "dev") {
  app.command("/imagine", bots.imagineBot.slash);
  app.command("/task", bots.taskBot.slash);
  app.command("/pokemon", bots.pokemonBot.slash);
  app.command("/riding-hood", bots.ridingHoodBot.slash);

  app.view(/task_submission/, bots.taskBot.viewSubmission);
  app.view(/pokemon_submission/, bots.pokemonBot.viewSubmission);

  app.message("testing testing", handleMessages.testing);
  app.message(/.*/, handleMessages.parseAll);

  app.event("reaction_added", handleEvents.reactionAdded);
  app.event("reaction_removed", handleEvents.reactionRemoved);
}

(async () => {
  global.BOT_CONFIG = {
    channel_openai_configs: {
      C06JLAQDG5T: {
        assistant: "asst_m5B8XkIqWaEtJGZnvM6RSSsg",
        thread: "thread_y5Tl2hPTh00CiUgoZJB7ioE4",
        runs: [],
      },
    },
  };
  // Check for folders
  if (!fs.existsSync("_temp")) {
    fs.mkdirSync("_temp");
  }

  if (!fs.existsSync("_output")) {
    fs.mkdirSync("_output");
  }
  // Start your app
  await app.start(process.env.PORT || 3000);
  llog.yellow("⚡️ Bolt app is running!");
  let slackResult = await app.client.chat.postMessage({
    channel: process.env.SLACK_101_BOTS_LOGS_CHANNEL,
    text: "starting up the 101 bots",
  });
  let logTest = await bots.loggingBot.logToSlack({
    client: app.client,
    text: "testing logging bot",
  });
})();
```

that's my app.js in a slack-bot using the bolt framework.

I now want to run some automated bots that periodically send the last hour or so of information to openai for processing and then send slacks to various channels and users.

So these bots aren't triggered by events or messages, but by scheduling. Can I have a "director-bot" that does two things:

1. on events, determines which of an array of bots should respond
2. using an array of schedules for each bot, determines when each bot should perform its scheduled task and send to slack? Like, for starters, I want a bot that, at 8am each day, takes the past 24 hours of activity in a given channel and then sends back a summary.

I know there are many parts, so let's bracket the openai calls for the summary for right now. I just want to think about the mechanics of directing scheduling for now.

## response

Certainly, you can create a "director-bot" that handles both event-based and scheduled tasks for other bots. For scheduled tasks, you would need some sort of task scheduler or cron job functionality. Node.js doesn't have a built-in task scheduler, but you can use third-party libraries such as `node-cron` or `node-schedule`.

Here's a basic outline of what you could do to add scheduled tasks to your Slack bot:

1. Install the `node-cron` package:

   ```sh
   npm install node-cron
   ```

2. Require the package in your code:

   ```javascript
   const cron = require("node-cron");
   ```

3. Define the schedules and the tasks for each bot in an array or another preferable data structure.

4. Create functions for each scheduled task that your bots should perform. For example:

   ```javascript
   async function createSummaryAndSendSlack(channelId) {
     // Fetch the last 24 hours of activity from the channel
     const activity = await getChannelActivity(channelId);

     // Maybe process the activity with OpenAI here

     // Send the summary back to the channel or user
     await app.client.chat.postMessage({
       channel: channelId,
       text: "Here is your daily summary...",
       // other message details
     });
   }
   ```

5. Schedule each task using `node-cron`. For example, to run a task every day at 8 AM:

   ```javascript
   cron.schedule("0 8 * * *", () => {
     // Assume 'C1234567890' is the channel's ID
     createSummaryAndSendSlack("C1234567890");
   });
   ```

6. For the event-based part, you can have the event handlers or middleware determine which bot should respond based on the event data. This logic could be built into the existing event handler structure you already have in place.

Putting it all together, you would have something like this:

```javascript
const cron = require("node-cron");
// ... other requires

// ... existing bot setup, middleware, and event handlers

// Define scheduled tasks for bots
const botSchedules = {
  summaryBot: {
    schedule: "0 8 * * *", // Every day at 8 AM
    task: (channelId) => createSummaryAndSendSlack(channelId),
  },
  // ... other bots' schedules
};

// Schedule tasks
Object.values(botSchedules).forEach((bot) => {
  cron.schedule(bot.schedule, () => bot.task("C1234567890"));
});

// ... existing app start logic and other startup tasks

// Functions for the bots' scheduled tasks
async function createSummaryAndSendSlack(channelId) {
  // ... implementation as above
}
```

Remember that `node-cron` supports different kinds of syntax for scheduling tasks, and you could add more complex schedules as per your requirements. You can use the same approach to schedule tasks for various bots with different responsibilities.

Note that this example uses the local time of the server where the bot is running. If you want to handle time zones or daylight saving time changes, you may need to integrate a library like `moment-timezone`.

## question

what about jobs that aren't for scheduling each day at a specific time, but according to other reasonable intervals, like

1. after 60 minutes of inactivity in a channel
2. after 10 messages have been posted
3. anything else you think would make sense?

## response

For tasks that are based on activity within a channel rather than a fixed time schedule, you'll need to implement a system to monitor the channel's activity and trigger actions based on certain conditions. Here are some examples:

4. **After 60 minutes of inactivity in a channel**:

You'll need to keep track of the last message timestamp for each channel where you want to monitor activity. Every time a message is posted, you update the timestamp. Then, you can use a setInterval or setTimeout function to check if the current time exceeds the last message time by 60 minutes.

Example (with a simplified monitoring system):

```javascript
const lastMessageTimestamps = new Map(); // Store timestamps per channel

// Function called on receiving a message
function updateLastMessageTimestamp(channelId) {
  lastMessageTimestamps.set(channelId, Date.now());
}

function checkInactivity() {
  const inactivityThreshold = 60 * 60 * 1000; // 60 minutes in milliseconds
  const currentTime = Date.now();
  for (const [channelId, lastTimestamp] of lastMessageTimestamps) {
    if (currentTime - lastTimestamp >= inactivityThreshold) {
      // Perform your action after 60 minutes of inactivity
      triggerActionForInactivity(channelId);
      // Reset or remove the timestamp if necessary
      lastMessageTimestamps.delete(channelId);
    }
  }
}

// Check for inactivity every minute
setInterval(checkInactivity, 60 * 1000);
```

5. **After 10 messages have been posted**:

Maintain a count of messages for each channel and trigger an action when the count reaches 10.

Example:

```javascript
const messagesCount = new Map(); // Store message counts per channel

// Function called on receiving a message
function handleMessage(channelId) {
  const count = (messagesCount.get(channelId) || 0) + 1;
  messagesCount.set(channelId, count);
  if (count >= 10) {
    // Perform your action after 10 messages
    triggerActionForMessageCount(channelId);
    messagesCount.set(channelId, 0); // Reset the count
  }
}
```

6. **Other reasonable intervals or conditions**:

- **Monitoring specific keywords or users**: Use regular expressions or string matching to perform actions when a message contains certain content.
- **Periodic reminders or check-ins**: Use `node-cron` or `setTimeout` to trigger reminders or periodic status requests.
- **Volume spikes**: Detect a sudden increase in message frequency and respond accordingly.
- **Custom command triggers**: Execute tasks based on commands issued by users in the Slack channel.
- **Monitoring reactions**: Perform actions when a message reaches a certain number of reactions or certain types of reactions are used.

These implementations are generally customizable and you can adjust the logic to fit exactly what you need your bots to accomplish. Remember that you will have to persist information such as timestamps and counts if your bot restarts, potentially using a database or another persistence layer if necessary.
