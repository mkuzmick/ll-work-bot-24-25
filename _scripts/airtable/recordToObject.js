// Change this name to use a different table
let projecTable = base.getTable("_PROJECTS");

// Prompt the user to pick a record 
// If this script is run from a button field, this will use the button's record instead.
let projectRecord = await input.recordAsync('Select a record to use', projecTable);

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

let recordObject = await recordIdToObject(projecTable, projectRecord.id);

// comment these out when you are done developing
output.inspect(recordObject)
output.text(JSON.stringify(recordObject, null, 4))

// change this to get the markdown that you want
output.text(`
# ${recordObject.Title}
Project Lead: ${recordObject.ProjectLead}
`)