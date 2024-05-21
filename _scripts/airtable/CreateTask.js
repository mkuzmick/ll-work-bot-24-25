const HACKMD_API_KEY="XXXXXXXXXXX"

// If this script is run from a button field, this will use the button's record instead.
let record = await input.recordAsync('Select a record to use', base.getTable('ProjectPlans'));
let tasksTable = base.getTable('Tasks');
let taskTypesTable = base.getTable('TaskTypes');
let workingDocsTable = base.getTable('WorkingDocs');

let TaskTypes = await taskTypesTable.selectRecordsAsync();
let buttons = TaskTypes.records.map(tt => {return ({label: tt.getCellValueAsString('TaskTitle'), value: tt.id})})

if (record) {
    output.markdown(`# Task Launch for ${record.getCellValueAsString('ProjectPlanName')}\nBefore we can create the task, we need to know the type. Please select from the list below and we'll create the appropriate documents for you.`)
    let taskTypeChoice = await input.buttonsAsync('', buttons);
    let taskTypeRecord = await taskTypesTable.selectRecordAsync(taskTypeChoice)
    let automations = taskTypeRecord.getCellValue("Automations");
    if (automations && automations.some(automation => automation.name === "hackMD")) {
        output.markdown(`## creating markdown\nlet's create a hackMD for you with this text:\n${taskTypeRecord.getCellValue("Code")}`);
        let payload = {
            title: `new note for ${record.getCellValueAsString("ProjectPlanName")}`,
            content: `${taskTypeRecord.getCellValue("Code")}`, 
            readPermission: "owner",
            writePermission: "owner"
        }
        
        let HACKMD_TEAM = taskTypeRecord.getCellValueAsString("HackMdTeam")
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
                    "WorkingDocName": `new doc for ${record.getCellValueAsString("ProjectPlanName")}`,
                    "WorkingDocURL": `${}`
                }
            }

        }
    }
} else {
    output.text('No record was selected');
}