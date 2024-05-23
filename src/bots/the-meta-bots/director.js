const bots = require("../index");

function getBotsArray(botsObject) {
  return Object.values(botsObject);
}

module.exports = async (client, message, event) => {
  // decide which bot to fire
  // const botNames = getBotsArray(bots).map(bot => )
};

// Function to convert an object of named exports (bots) to an array

// // Function to handle Slack events
// function handleSlackEvent(event) {
//   // Assuming 'event.text' contains the Slack message text
//   const messageText = event.text;
//   const botArray = getBotsArray(bots);

//   // Loop through all bots to check for trigger matches
//   botArray.forEach((bot) => {
//     // Ensure bot has a trigger and respond method, and messageText includes the trigger
//     if (bot.trigger && bot.respond && messageText.includes(bot.trigger)) {
//       console.log(`Trigger found for bot: ${bot.trigger}`);
//       // Respond to the event
//       bot.respond(event);
//       // Assuming only one bot should respond at a time, you may stop after the first match
//     }
//   });
// }
