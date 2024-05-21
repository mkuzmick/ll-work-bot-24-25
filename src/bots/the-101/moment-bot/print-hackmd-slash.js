const llog = require('learninglab-log')
const randomMoment = require('./random-moment')
const airtableTools = require(`../../utils/ll-airtable-tools`)
const puppeteer = require('puppeteer');
const fs = require('fs');
var MarkdownIt = require('markdown-it');
const axios = require('axios');

function hackMdIdFromUrl(url) {
    const regex = /https:\/\/hackmd\.io\/([a-zA-Z0-9\-_]+)(?:\?.+)?/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const printHackMdSlash = async ({ command, ack, client}) => {
    // llog.red(llog.divider, JSON.stringify(global.BOT_CONFIG, null, 4), llog.divider)
    await ack();
    llog.cyan(
        llog.divider, 
        `a slash command has called for the hackmd-2-pdf`, 
        llog.divider, 
        JSON.stringify(command, null, 4), 
        llog.divider)
    try {
        const response = await axios.get(`https://api.hackmd.io/v1/notes/${hackMdIdFromUrl(command.text)}`, {
            headers: {
                "Authorization": `Bearer ${process.env.HACKMD_API_KEY}`
            }
        });

        llog.yellow('response.data', response.data);
        md = new MarkdownIt();
        var htmlContent = md.render(response.data.content);
        const cssStyles = await fs.promises.readFile('./src/styles/avenir-white.css', 'utf-8');
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
        await fs.promises.writeFile(`./_output/output.pdf`, pdfBuffer);
        const result = await client.chat.postMessage({
            channel: command.channel_id,
            text: "going to work on that",
            // blocks: blocks
        })
        llog.magenta(result)
  
        try {
            await client.files.upload({
              channels: command.channel_id,
              initial_comment: "this is a test",
              file: fs.createReadStream(`./_output/output.pdf`)
            })
          } catch (error) {
            console.log(error)
          }


    } catch (error) {
        llog.red(`couldn't post message in response to moment slash`, error )
    }
}

module.exports = printHackMdSlash;

