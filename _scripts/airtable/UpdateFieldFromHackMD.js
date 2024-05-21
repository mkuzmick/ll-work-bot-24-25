// Change this name to use a different table
let table = base.getTable("DocTemplates");

// Prompt the user to pick a record 
// If this script is run from a button field, this will use the button's record instead.
let record = await input.recordAsync('Select a record to use', table);
output.inspect(record)

function extractHackMDDocID(url) {
    const regex = /https:\/\/hackmd\.io\/([a-zA-Z0-9_-]+)/;
    const match = regex.exec(url);

    if (match) {
        return match[1]; // Extracted doc ID
    } else {
        return null; // URL pattern not matched
    }
}

let hackMdTemplateId = extractHackMDDocID(record.getCellValueAsString("HackMdTemplateUrl"));

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


const getHackMdTemplate = async ({noteId, HACKMD_API_KEY, HACKMD_TEAM}) => {
    // GET /notes/:noteId
    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/notes/${noteId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${HACKMD_API_KEY}`,
        }
    });
    if (response.ok) {
        let data = await response.json();
        output.inspect(data);
        return data
    } else {
        return "error creating HackMd"
    }
}


let CONFIG = await getConfig()
output.inspect(CONFIG)

let hackMdTemplateResult = await getHackMdTemplate({
    HACKMD_API_KEY: CONFIG.HACKMD_API_KEY,
    HACKMD_TEAM: CONFIG.HACKMD_TEAM,
    noteId: hackMdTemplateId
})

output.inspect(hackMdTemplateResult)

try {
    let updatedRecord = await table.updateRecordAsync(record, {
        "TemplateMarkdown": hackMdTemplateResult.content
    });
    
    console.log("Record updated successfully:", updatedRecord);
} catch (error) {
    console.error("Error updating record:", error);
}