const { llog } = require("../ll-utilities")
const markdownpdf = require("markdown-pdf")
const axios = require('axios');
// const marked = require('marked');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
var MarkdownIt = require('markdown-it');



function hackMdIdFromUrl(url) {
    const regex = /https:\/\/hackmd\.io\/([a-zA-Z0-9\-_]+)(?:\?.+)?/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


exports.atemButtons = async () => {
    ack();
    try {
        llog.red(command, null, 4)
        console.log(`let's try a simple switch to camera ${command.text}`)
        const blx = await atemButtonBlocks()
        llog.blue(blx)
        if (command.channel_name !== "directmessage") {
            await say({
                blocks: blx,
                text: `this game requires blocks`
            })
        } else {
            await client.chat.postMessage({
                blocks: blx,
                channel: command.user_id,
                text: `this game requires blocks`
            })
        }
    } catch (error) {
        llog.red(error)
    }
    
}


module.exports.printHackmd = async ({ command, client, ack, say }) => {
    console.log(`going to convert ${hackmdUrl} to markdown`);
    ack();
    try {
        console.log('working on it...');
        const response = await axios.get(`https://api.hackmd.io/v1/notes/${hackMdIdFromUrl(hackmdUrl)}`, {
            headers: {
                "Authorization": `Bearer ${process.env.HACKMD_API_KEY}`
            }
        });
        llog.yellow('response.data', response.data);

        md = new MarkdownIt();
        var htmlContent = md.render(response.data.content);

        const cssStyles = await fs.readFile('./src/styles/modest.css', 'utf-8');
        const fullHtml = `
            <html>
                <head>
                    <style>${cssStyles}</style>
                </head>
                <body>${htmlContent}</body>
            </html>
        `;

        // Launch puppeteer to generate the PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(fullHtml, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        // You can save the PDF buffer to a file or return as needed
        await fs.writeFile('output.pdf', pdfBuffer);

        // return pdfBuffer; // Return the PDF buffer if needed
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
