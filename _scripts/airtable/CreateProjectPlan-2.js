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


const createHackMd = async ({title, content, HACKMD_API_KEY, HACKMD_TEAM}) => {
    let payload = {
        title: title,
        content: content,
        tags: ["a-tag", "another-tag"]
    }
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

const generateMarkdown = async (record) => {
    let markdown = ""
    let templateTable = base.getTable("DocTemplates");
    let templates = await templateTable.selectRecordsAsync();
    let buttons = templates.records.map(template => {return ({label: template.getCellValueAsString('TaskTitle'), value: template.id})})
    buttons.push({label: "I'm Done!", value: "done"})
    output.markdown(`# start\nBefore we can create the template, we need to know the type. Please select from the list below and we'll create the appropriate documents for you.`)
    let templateChoice = await input.buttonsAsync('choose', buttons);
    output.inspect(templateChoice)
    let theTemplate = await templateTable.selectRecordAsync(templateChoice)
    output.inspect(theTemplate)
    markdown+="---"
    return markdown
}


let CONFIG = await getConfig()
output.inspect(CONFIG)

let theMarkdown = await generateMarkdown("record");
output.inspect(theMarkdown)

let hackMdResult = await createHackMd({
    HACKMD_TEAM: CONFIG.HACKMD_TEAM,
    HACKMD_API_KEY: CONFIG.HACKMD_API_KEY,
    title: "test title",
    content: "some content"
})

output.inspect(hackMdResult)



// get template record

// get template markdown

// find fields in template

// insert field values if exist

let payload = {
    title: `new project plan book for ${projectPlanRecord.getCellValueAsString("ProjectPlanName")}`,
    content: `
${projectPlanRecord.getCellValueAsString("ProjectPlanName")}-book
===

today
---

- [ll-event-lab-today](/QMgM6lVvS6O55J8zdkQLCA)
- [week-0-duplicate-for-event-lab](/NnIb3qijSL-kSMoZmglBTQ)
- [ll-event-lab-taster-basics](/EexbJboDRWykQVKX-vSn-Q)

focal points
---

- [ll-event-lab-rationale-v1](/AunryFEcRm6SG8qAbHAyIw)
- [ll-event-lab-rationale-v2](/jAXHsrujSViTBcTIOOlBUw)
- [ll-event-lab-book](/el_J665jQaSilY0ObISWag)
- [ll-event-lab-ilp](/n61EI_4bQRmTXjtXSAFYIw)
- [ll-event-lab-basic-skills](/LUhM1BCtRR2ctOGHsq_z5A)
- [ll-event-bot-24-notes-20230814](/UaajTC7-SROLyrrlu42smg)
- [ll-moment-base-notes-20230814](/yPHUXgUEQn6UJG3Bg9polA)
- [ll-event-lab-mechanics-20230814](/m1MzrcWLQ6WeNx9DRFAW6Q)
- [ll-event-lab-taster-script-20230814](/wUKItYnfSJGx0jA0r9uBPQ)`, 
    readPermission: "owner",
    writePermission: "owner"
}


{
    

    let newDocRecord = {
        fields: {
            "WorkingDocName": `new book doc for ${projectPlanRecord.getCellValueAsString("ProjectPlanName")}`,
            "WorkingDocURL": `https://hackmd.io/${data.id}`,
            "ProjectPlans": [{id: projectPlanRecordId}]
        }
    }
    const newDocAirtableRecord = await workingDocsTable.createRecordsAsync([newDocRecord])
    output.inspect(newDocAirtableRecord)

    // let newTaskData = {
    //     fields: {
    //         "Title": `new task for ${record.getCellValueAsString("ProjectPlanName")}`,
    //         "WorkingDocs": [{id: newDocAirtableRecord[0]}],
    //         "ProjectPlans": [{id: record.id}]
    //     }
    // }
    // await tasksTable.createRecordsAsync([newTaskData])



let tasksTable = base.getTable('Tasks');
let taskTypesTable = base.getTable('TaskTypes');
let workingDocsTable = base.getTable('WorkingDocs');
let projectPlansTable = base.getTable('ProjectPlans');

// get Project record
// If this script is run from a button field, this will use the button's record instead.
let record = await input.recordAsync('Select a record to use', base.getTable('_PROJECTS'));

const getDate = () => {
    return (new Date())
}

const makeHackMD = async (options) => {

}

// create Project Plan record
if (record) {
    output.text(`slug for this record is ${record.getCellValue("Id")}`)
    output.text(`doing this at ${getDate()}`)
    let theNewRecord = {
    'ProjectPlanName': `${record.getCellValueAsString("Id")}-project-plan`,
    '_PROJECTS': [{id: record.id}]
    }
    let projectPlanRecordId = await projectPlansTable.createRecordAsync(theNewRecord)
    let projectPlanRecord = await projectPlansTable.selectRecordAsync(projectPlanRecordId)
    let payload = {
            title: `new project plan book for ${projectPlanRecord.getCellValueAsString("ProjectPlanName")}`,
            content: `
${projectPlanRecord.getCellValueAsString("ProjectPlanName")}-book
===

today
---

- [ll-event-lab-today](/QMgM6lVvS6O55J8zdkQLCA)
- [week-0-duplicate-for-event-lab](/NnIb3qijSL-kSMoZmglBTQ)
- [ll-event-lab-taster-basics](/EexbJboDRWykQVKX-vSn-Q)

focal points
---

- [ll-event-lab-rationale-v1](/AunryFEcRm6SG8qAbHAyIw)
- [ll-event-lab-rationale-v2](/jAXHsrujSViTBcTIOOlBUw)
- [ll-event-lab-book](/el_J665jQaSilY0ObISWag)
- [ll-event-lab-ilp](/n61EI_4bQRmTXjtXSAFYIw)
- [ll-event-lab-basic-skills](/LUhM1BCtRR2ctOGHsq_z5A)
- [ll-event-bot-24-notes-20230814](/UaajTC7-SROLyrrlu42smg)
- [ll-moment-base-notes-20230814](/yPHUXgUEQn6UJG3Bg9polA)
- [ll-event-lab-mechanics-20230814](/m1MzrcWLQ6WeNx9DRFAW6Q)
- [ll-event-lab-taster-script-20230814](/wUKItYnfSJGx0jA0r9uBPQ)`, 
            readPermission: "owner",
            writePermission: "owner"
        }
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

            let newDocRecord = {
                fields: {
                    "WorkingDocName": `new book doc for ${projectPlanRecord.getCellValueAsString("ProjectPlanName")}`,
                    "WorkingDocURL": `https://hackmd.io/${data.id}`,
                    "ProjectPlans": [{id: projectPlanRecordId}]
                }
            }
            const newDocAirtableRecord = await workingDocsTable.createRecordsAsync([newDocRecord])
            output.inspect(newDocAirtableRecord)

            // let newTaskData = {
            //     fields: {
            //         "Title": `new task for ${record.getCellValueAsString("ProjectPlanName")}`,
            //         "WorkingDocs": [{id: newDocAirtableRecord[0]}],
            //         "ProjectPlans": [{id: record.id}]
            //     }
            // }
            // await tasksTable.createRecordsAsync([newTaskData])

        }
} else {
    output.text('No record was selected');
}


