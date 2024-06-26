const Airtable = require(`airtable`);
const llog = require("learninglab-log");

async function getOneBaseConfig(options) {
  var base = new Airtable({ apiKey: options.apiKey }).base(options.baseId);
  const theRecords = [];
  await base(options.table)
    .select({
      maxRecords: 100,
    })
    .eachPage(function page(records, next) {
      theRecords.push(...records);
      next();
    })
    .catch((err) => {
      console.error(err);
      return;
    });
  // console.log(JSON.stringify(theRecords, null, 4))
  return theRecords;
}

module.exports = async function ({ baseId, table }) {
  llog.cyan({
    apiKey: process.env.AIRTABLE_API_TOKEN,
    baseId: baseId,
    table: table,
  });
  const theRecords = await getOneBaseConfig({
    apiKey: process.env.AIRTABLE_API_TOKEN,
    baseId: baseId,
    table: table,
  });
  // console.log(JSON.stringify(theRecords, null, 4))
  return theRecords;
};
