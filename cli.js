#!/usr/bin/env node

var figlet = require("figlet");
var clear = require("clear");
const llog = require("learninglab-log");
require("dotenv").config({ path: __dirname + `/.env.cli` });

// store any arguments passed in using yargs
var yargs = require("yargs").argv;

const {
  getSlackMessage,
  getSlackFileInfo,
} = require("./src/utils/ll-slack-tools");

// options: rename, makefolders, proxy, proxyf2,
const main = async (yargs) => {
  if (yargs.getSlackMessage) {
    llog.red(__dirname + `/.env.cli`);
    let result = await getSlackMessage({
      ts: yargs.ts,
      channel: yargs.channel,
    });
    llog.magenta(result);
  } else if (yargs.getSlackFileInfo) {
    llog.red(__dirname + `/.env.cli`);
    let result = await getSlackFileInfo({
      file: yargs.file,
    });
    llog.magenta(result);
  } else if (yargs.rename) {
    // llog.magenta(`going to rename`, yargs)
  } else if (yargs.phackmd) {
    // llog.magenta(`going to convert ${yargs.phackmd} to markdown`);
    // hackmd2pdf(yargs.phackmd);
  } else if (yargs.finetune) {
    // llog.magenta(`going to handle ${yargs.finetune}`);
    // finetune({txt: yargs.txt});
  } else {
    console.log(`sorry, you didn't enter a recognized command.`);
  }
};

console.log("launching it.");
main(yargs);
