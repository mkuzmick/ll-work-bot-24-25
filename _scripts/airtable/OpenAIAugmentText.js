// Fetch all records from the Config table
let configTable = base.getTable("Config");
let configRecords = await configTable.selectRecordsAsync();

// Find the record with the "Name" field set to "OPENAI_API_KEY"
let apiKeyRecord = configRecords.records.find(record => record.getCellValue("Name") === "OPENAI_API_KEY");

// Extract the API key from the record
let OPENAI_API_KEY;
if (apiKeyRecord) {
    OPENAI_API_KEY = apiKeyRecord.getCellValueAsString("StringValue");
} else {
    throw new Error("OPENAI_API_KEY not found in Config table.");
}

let table = base.getTable("Moments");

// Prompt the user to pick a record 
// If this script is run from a button field, this will use the button's record instead.
let record = await input.recordAsync('Select a record to use', table);

if (record) {
    output.text(`You selected this record: ${record.getCellValueAsString("Name")}`);
    let initialText = record.getCellValueAsString("InitialText")

    // define endpoint--ultimately we can specify this in a field
    const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

    // Define the payload for the request
    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are an expert journalist writing for the Chronicle of Higher Education."},
            {role: "user", content: "Please expand on this text in a style that would be appropriate for a professional academic setting."},
            {role: "assistant", content: "Certainly. Please specify the text."},
            {role: "user", content: initialText}
        ]
    };

    // Make the API request using remoteFetchAsync
    let response = await remoteFetchAsync(OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    // Parse the response and log the result
    if (response.ok) {
        let data = await response.json();
        output.text("data:")
        output.inspect(data)
        let tweakedText = data.choices[0].message.content;
        output.text(tweakedText);

        // Update the Airtable record with the tweaked text
        await table.updateRecordAsync(record, {
            "ChatGPTText": tweakedText,
            "APIEndpoint": OPENAI_ENDPOINT,
            "Payload": JSON.stringify(payload, null, 4)
        });




    } else {
        output.text("Error fetching data from OpenAI.");
        output.inspect(response)
        let errorData = await response.json();
        output.inspect(errorData);
    }

} else {
    output.text('No record was selected');
}