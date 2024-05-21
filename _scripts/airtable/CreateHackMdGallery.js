let desiredConfig = "MK_CONFIG"

const getConfig = async () => {
    let launchDate = new Date();
    let configTable = base.getTable("Config");
    let configRecords = await configTable.selectRecordsAsync();
    let configRecord = configRecords.records.find(record => record.getCellValue("Name") === desiredConfig);
    let config = JSON.parse(configRecord.getCellValueAsString("JSONValue"))
    config.launchTs = launchDate.getTime();
    return config
}

let CONFIG = await getConfig()
output.text("CONFIG:")
output.inspect(CONFIG)

let galleryTable = base.getTable("Galleries");

let galleryRecord = await input.recordAsync("select a record", galleryTable)

output.inspect(galleryRecord)

output.inspect(galleryRecord.getCellValue("ShowYourImages"))
output.inspect(galleryRecord.getCellValue("SlackUrl (from ShowYourImages)"))

output.inspect(galleryRecord.getCellValue("Title (from ShowYourImages)"))




