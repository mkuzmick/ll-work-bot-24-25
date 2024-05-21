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
    return value ? value : `${defaultValue} ${value}`;
};

const generateFormattedMarkdown = (record, template) => {
    output.text("generating markdown from template");
    output.inspect(record)
    output.inspect(template)
    output.inspect(record)
    let dynamicTemplate = template.replace(/\{\{(.+?)\}\}/g, (match, property) => {
        return replacePlaceholder(record[property], `add ${property}`);
    });

    return dynamicTemplate;
};


// rewrite to add all links to all task docs
const createProjectBook = async ({project, HACKMD_API_KEY, HACKMD_TEAM}) => {
    let templateTable = base.getTable("DocTemplates");
    let projectBookTemplateRecord = await templateTable.selectRecordAsync(projectBookRecordId);
    let projectBookTemplate = projectBookTemplateRecord.getCellValue("TemplateMarkdown");
    output.inspect(project);
    let linkText = ``;
    for (const doc of projectWithPlanAndDocs.workingDocs) {
        linkText += `- [${doc.title}](${doc.url})\n`;
    }
    
    let payload = {
        title: `new project plan book for ${project.projectPlan.ProjectPlanName || "no title"}`,
        content: `${projectBookTemplate} \n\ndocs\n---\n${linkText}`, 
        readPermission: "owner",
        writePermission: "owner"
    }

    output.inspect(payload)
    
    let response = await remoteFetchAsync(`https://api.hackmd.io/v1/teams/${HACKMD_TEAM}/notes`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HACKMD_API_KEY}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload) 
    });
    if (response.ok) {
        let data = await response.json();
        output.inspect(data);
        return data
    } else {
        return "error creating HackMd"
    }
}

// take data from project record object and create project plan
async function createProjectPlan (project) {
    let table = base.getTable("ProjectPlans");
    let record = await table.createRecordAsync({
        "ProjectPlanName": project.Id,
        "_PROJECTS": [{id: project.airtableRecordId}]
    })
    output.text("created ProjectPlan record")
    output.inspect(record)
    return recordIdToObject(table, record)
}

const generateDocAndTask = async ({projectForDocsAndTasks, typeId}) => {
    let result = {createdTime: (new Date()).getTime()};
    let templateTable = base.getTable("DocTemplates");
    let workingDocsTable = base.getTable('WorkingDocs');
    let tasksTable = base.getTable('Tasks');
    output.text("getting docTemplate")
    let docTemplate = await templateTable.selectRecordAsync(typeId);
    output.inspect(docTemplate)
    let docTemplateObject = await recordIdToObject(templateTable, docTemplate.id);
    output.inspect(docTemplateObject);
    output.text(`going to create ${docTemplate.getCellValue("TaskTypeName")}`)
    output.inspect(projectForDocsAndTasks)
    output.text(JSON.stringify(projectForDocsAndTasks, null, 4))
    // create task first
    let taskRecordId = await tasksTable.createRecordAsync({
        "Title": `${docTemplateObject.TaskTypeName} for ${projectForDocsAndTasks.Id}`,
        "ProjectPlans": [{id: projectForDocsAndTasks.projectPlan.airtableRecordId}]
    })
    output.text("taskRecordId")
    output.inspect(taskRecordId)
    result.task = taskRecordId
    // create doc
    output.text("creating doc")

    let formattedMarkdown = generateFormattedMarkdown(projectForDocsAndTasks.projectPlan, docTemplate.getCellValue("TemplateMarkdown"));

    let payload = {
        title: `new ${docTemplate.getCellValue("TaskTypeName")} for ${projectForDocsAndTasks.projectPlan.ProjectPlanName || "no title"}`,
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
            "WorkingDocName": `new ${docTemplate.getCellValue("TaskTypeName")} for ${projectForDocsAndTasks.projectPlan.ProjectPlanName || "no title"}`,
            "Tasks": [{id: result.task}],
            "WorkingDocURL": `https://hackmd.io/${data.id}`,
            "ProjectPlans": [{id: projectForDocsAndTasks.projectPlan.airtableRecordId}]

        })
        result.workingDoc = {
            "url": `https://hackmd.io/${data.id}`,
            "title": `new ${docTemplate.getCellValue("TaskTypeName")} for ${projectForDocsAndTasks.projectPlan.ProjectPlanName || "no title"}`
        }
    } else {
        return "error creating HackMd"
    }
    

    return result
}

const generateWorkingDocs = async (project) => {
    let templateTable = base.getTable("DocTemplates");
    let optionsView = templateTable.getView("CREATE_PROJECT_PLAN_OPTIONS")
    let templates = await optionsView.selectRecordsAsync();
    let buttons = templates.records.map(template => {return ({label: template.getCellValueAsString('TaskTitle'), value: template.id})})
    buttons.push({label: "I'm Done!", value: "done"})
    let templateChoice = await input.buttonsAsync('', buttons);
    output.inspect(templateChoice)
    if (templateChoice=="done") {
        return project
    } else {
        let taskResult = await generateDocAndTask({
            projectForDocsAndTasks: project, typeId: templateChoice
        })
        project.tasks.push(taskResult.task)
        project.workingDocs.push(taskResult.workingDoc)
        return generateWorkingDocs(project)
    }

    // let theTemplate = await templateTable.selectRecordAsync(templateChoice)
    // output.inspect(theTemplate)
    // markdown+="---"
    // return markdown
    return templateChoice
}

// If this script is run from a button field, this will use the button's record instead.
let table = base.getTable('_PROJECTS');
let record = await input.recordAsync('Select a record to use', table);



let project = await recordIdToObject(table, record.id)
project.tasks = []
project.workingDocs = []
let projectPlan = await createProjectPlan(project)
output.text("created projectPlan")
output.inspect(projectPlan)
project.projectPlan = projectPlan;
output.inspect(project)


output.markdown(`# start\nBefore we can create the template, we need to know the type. Please select from the list below and we'll create the appropriate documents for you.`)

// maybe don't mutate the project in the function?
let projectWithPlanAndDocs = await generateWorkingDocs(project);
output.inspect(projectWithPlanAndDocs)

let projectBookId = await createProjectBook({project: projectWithPlanAndDocs, HACKMD_API_KEY: CONFIG.HACKMD_API_KEY, HACKMD_TEAM: CONFIG.HACKMD_TEAM });
// let hackMdResult = await createProjectBook({
//     HACKMD_TEAM: CONFIG.HACKMD_TEAM,
//     HACKMD_API_KEY: CONFIG.HACKMD_API_KEY,
//     project: project
// })

// output.inspect(hackMdResult)


