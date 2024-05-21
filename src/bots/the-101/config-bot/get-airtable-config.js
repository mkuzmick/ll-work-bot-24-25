const Airtable = require(`airtable`)
const llog = require('learninglab-log')

const basesWithConfig = [process.env.AIRTABLE_MOMENTS_BASE, process.env.AIRTABLE_EVENTS_BASE]

async function getOneBaseConfig(options) {
  var base = new Airtable({apiKey: options.apiKey}).base(options.baseId);
  const theRecords = [];
  await base(options.table).select(
    {
      maxRecords: 100,
    }
  ).eachPage(function page(records, next){
    theRecords.push(...records);
    next()
  })
  .catch(err=>{console.error(err); return})
  // console.log(JSON.stringify(theRecords, null, 4))
  return theRecords;
}

module.exports = async function(options) {
  const theRecords = await getOneBaseConfig({
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_MOMENTS_BASE,
    table: "_CHANNELCONFIG"
  })
  // console.log(JSON.stringify(theRecords, null, 4))
  return theRecords;
}

