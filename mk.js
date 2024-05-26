#!/usr/bin/env node

const figlet = require("figlet");
const clear = require("clear");
const llog = require("learninglab-log");
const cp = require("child_process");
const path = require("path");
const { muybridge } = require("./src/bots/the-101/muybridge-bot");

require("dotenv").config({ path: __dirname + `/.env.mk` });

var yargs = require("yargs").argv;

const main = async (yargs) => {
  llog.blue(yargs);
  if (yargs.start || yargs._[0] == "start") {
    const result = await new Promise((resolve, reject) => {
      cp.exec(
        path.resolve(__dirname, "./_scripts/ex/mkstart"),
        (error, stdout, stderr) => {
          if (error) {
            reject(`error: ${error.message}`);
          } else if (stderr) {
            reject(`stderr: ${stderr}`);
          } else {
            resolve(`stdout: ${stdout}`);
          }
        },
      );
    });
    llog.blue(result);
  }
  if (yargs.muybridge) {
    const result = await muybridge(yargs.file);
    llog.blue(result);
  } else if (true) {
    llog.magenta("other stuff coming soon");
  } else {
    console.log(`sorry, you didn't enter a recognized command.`);
  }
};

console.log("launching it.");
main(yargs);
