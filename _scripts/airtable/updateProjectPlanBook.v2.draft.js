let desiredConfig = "MK_CONFIG"
let projectBookRecordId = "rec5TVuJK5MSaN5xf"


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

const generateBookPayload = async (projectPlan) => {
    let templateTable = base.getTable("TaskTypes");
    let projectBookTemplateRecord = await templateTable.selectRecordAsync(projectBookRecordId);
    let projectBookTemplate = projectBookTemplateRecord.getCellValue("TaskTypeMarkdownTemplate");
    output.text("projectBookTemplate")
    output.inspect(projectBookTemplate)
    let linkText = ``;
    // Assuming both arrays have the same length, you can use one array's length for the loop
    for (let i = 0; i < projectPlan.WorkingDocNames.length; i++) {
        linkText += `- [${projectPlan.WorkingDocNames[i]}](${projectPlan.WorkingDocURLs[i]})\n`;
    }
    let finalContent = `${projectBookTemplate} \n\ndocs\n---\n${linkText}`
    output.text(finalContent)
    return {
        content: finalContent, 
        readPermission: "owner",
        writePermission: "owner"
    }
}

function extractHackMDId(link) {
    const regex = /hackmd\.io\/(.+)$/;
    const match = link.match(regex);
    if (match && match.length === 2) {
        return match[1]; // The ID is in the first capturing group
    }
    return null; // Return null if no match is found
}

let payload = await generateBookPayload(projectPlan)
let noteId = extractHackMDId(projectPlan.ProjectPlanUrl)
output.inspect(noteId)
output.inspect(payload)


let response = await remoteFetchAsync(`https://api.hackmd.io/v1/teams/${CONFIG.HACKMD_TEAM}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
        "Authorization": `Bearer ${CONFIG.HACKMD_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
});



if (response.ok) {
    // let data = await response.json();
    output.text("success")
    output.inspect(response)
} else {
    // let errorResponse = await response.json(); // Parse the error response
    output.text("error")
    output.inspect(response);

}


