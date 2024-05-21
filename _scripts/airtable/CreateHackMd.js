let desiredConfig = "MK_CONFIG"

const getConfig = async () => {
    let config = {launchTs: new Date().getTime()}
    let configTable = base.getTable("Config");
    let configRecords = await configTable.selectRecordsAsync();
    let config = configRecords.records.find(record => record.getCellValue("Name") === desiredConfig);
    return config
}


let configTable = base.getTable("Config");

// Fetch all records from the table
let records = await configTable.selectRecordsAsync();

// Filter the records to find the one with the desired value in the 'Name' field
let desiredRecord = records.records.find(record => record.getCellValue("Name") === "MK_CONFIG");

if (desiredRecord) {
    console.log("Found the record:", desiredRecord);
} else {
    console.log("Record not found.");
}


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
