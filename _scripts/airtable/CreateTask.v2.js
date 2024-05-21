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
// output.text("CONFIG:")
// output.inspect(CONFIG)

async function recordIdToObject(myTable, recordId) {
    const record = await myTable.selectRecordAsync(recordId);
    // If the record doesn't exist, return null or handle as needed
    if (!record) {
        return null;
    }
    const recordObject = {};
    for (const field of myTable.fields) {
        const fieldName = field.name;
        recordObject[fieldName] = record.getCellValue(fieldName);
    }
    recordObject.airtableRecordId = record.id;
    recordObject.airtableRecordName = record.name;
    return recordObject;
}

const replacePlaceholder = (value, defaultValue = "add") => {
    if (Array.isArray(value) && value.every(item => typeof item === "string")) {
        output.inspect(value)
        output.text("array")
        output.text(value[0])
        return value.join(", ");
    } else {
        return value ? value : `${defaultValue} ${value}`;
    }
};

const generateFormattedMarkdown = (record, template) => {
    output.text("generating markdown from template");
    output.text("the template")
    output.inspect(template)
    output.text("the record")
    output.inspect(record)
    let dynamicTemplate = template.replace(/\{\{(.+?)\}\}/g, (match, property) => {
        return replacePlaceholder(record[property], `add ${property}`);
    });
    output.text(dynamicTemplate)
    return dynamicTemplate;
};



// If this script is run from a button field, this will use the button's record instead.
let table = base.getTable('ProjectPlans');
let projectPlanRecord = await input.recordAsync('Select a record to use', table);
let projectPlan = await recordIdToObject(table, projectPlanRecord.id);
// output.inspect(projectPlan)

output.markdown(`# start\nPlease select the type of task you'd like to create.`)

let taskTypesTable = base.getTable('TaskTypes');
let taskTypesView = taskTypesTable.getView("MOST_COMMON_TASKS");
let taskTypes = await taskTypesView.selectRecordsAsync();
let buttons = taskTypes.records.map(taskType => {return ({label: taskType.getCellValueAsString('TaskTypeName'), value: taskType.id}) })
let taskTypeChoice = await input.buttonsAsync('', buttons);

output.inspect(taskTypeChoice);

let workingDocsTable = base.getTable('WorkingDocs');
let tasksTable = base.getTable('Tasks');
let taskTypeTemplateRecord = await taskTypesTable.selectRecordAsync(taskTypeChoice)
output.inspect(taskTypeTemplateRecord)
let taskTypeTemplate = await recordIdToObject(taskTypesTable, taskTypeTemplateRecord.id)

output.inspect(taskTypeTemplate)

let taskRecordId = await tasksTable.createRecordAsync({
    "Title": `${taskTypeTemplate.TaskTypeName} for ${projectPlan.ProjectPlanName}`,
    "ProjectPlans": [{id: projectPlan.airtableRecordId}]
})
output.text("taskRecordId")
output.inspect(taskRecordId)

if (taskTypeTemplate.TaskTypeMarkdownTemplate !== null) {
    output.text('generating doc')
    let formattedMarkdown = generateFormattedMarkdown(projectPlan, taskTypeTemplate.TaskTypeMarkdownTemplate);

    let payload = {
        title: `new ${taskTypeTemplate.TaskTypeName} for ${projectPlan.ProjectPlanName || "no title"}`,
        content: formattedMarkdown, 
        readPermission: "owner",
        writePermission: "owner"
    }
    output.inspect(payload)
    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/teams/${CONFIG.HACKMD_TEAM}/notes`, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${CONFIG.HACKMD_API_KEY}`,
        "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        let data = await response.json();
        output.inspect(data);
        let workingDocRecord = await workingDocsTable.createRecordAsync({
            "WorkingDocName": `new ${taskTypeTemplate.TaskTypeName} for ${projectPlan.ProjectPlanName || "no title"}`,
            "Tasks": [{ id: taskRecordId }],
            "WorkingDocURL": `https://hackmd.io/${data.id}`,
            "ProjectPlans": [{ id: projectPlan.airtableRecordId }]
        });
    } else {
        return "error creating HackMd";
    }

    
}



    