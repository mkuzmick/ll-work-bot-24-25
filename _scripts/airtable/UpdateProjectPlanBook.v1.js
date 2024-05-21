let desiredConfig = "MK_CONFIG"
let projectBookRecordId = "recK3EReWxSzOFSQC"

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
// output.text("CONFIG:")
// output.inspect(CONFIG)


// Change this name to use a different table
let projectPlanTable = base.getTable("ProjectPlans");

// Prompt the user to pick a record 
// If this script is run from a button field, this will use the button's record instead.
let projectPlanRecord = await input.recordAsync('Select a record to use', projectPlanTable);

async function recordIdToObject(myTable, recordId) {
    // Fetch the record using the provided recordId
    const record = await myTable.selectRecordsAsync({ recordIds: [recordId] });

    // If the record doesn't exist, return null or handle as needed
    if (!record.records.length) {
        return null;
    }

    const singleRecord = record.records[0];
    const fields = myTable.fields;
    const recordObject = {};

    // Iterate over all fields and get their values
    for (const field of fields) {
        const fieldName = field.name;
        recordObject[fieldName] = singleRecord.getCellValue(fieldName);
    }

    return recordObject;
}

let workingDocsTable = base.getTable("WorkingDocs");


let projectPlan = await recordIdToObject(projectPlanTable, projectPlanRecord.id);

output.inspect(projectPlan)

const updateHackMDNote = async ({ noteId, content, HACKMD_API_KEY, HACKMD_TEAM }) => {
    let payload = {
        content: content,
        readPermission: "signed_in",
        writePermission: "owner"
    };

    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${HACKMD_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        let data = await response.json();
        return data;
    } else {
        return "error updating HackMd";
    }
};
