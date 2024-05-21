const axios = require("axios");
const fs = require("fs");
const path = require("path");
const llog = require("learninglab-log");
// Replace this with your actual endpoint and request body data

module.exports = async (prompt) => {
  const start = Date.now(); // Start timing here

  const output_folder = path.join(ROOT_DIR, "_output");
  const url = `https://${process.env.GRADIO_KEY}.gradio.live/sdapi/v1/txt2img`;
  const data = {
    prompt: prompt,
    // Include the rest of your necessary properties
  };
  axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        // Include any other necessary headers like authorization
      },
    })
    .then((response) => {
      console.log(response);
      llog.cyan(response.data);
      const images = response.data.images; // Adjust according to the actual response structure
      images.forEach((base64Image, index) => {
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const fileName = `sd_image_${index}_${timestamp}.png`;
        const filePath = path.join(output_folder, fileName);

        const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(filePath, base64Data, "base64", (err) => {
          if (err) {
            console.error(`Failed to save image ${index}:`, err);
          } else {
            console.log(`Saved to ${filePath}`);
          }
        });
      });
    })
    .then(() => {
      const stop = Date.now(); // Stop timing after the last image is saved
      const duration = (stop - start) / 1000; // Convert duration to seconds
      console.log(`Duration: ${duration} seconds.`);
    })
    .catch((error) => {
      console.error("Failed to fetch images:", error);
    });
};
