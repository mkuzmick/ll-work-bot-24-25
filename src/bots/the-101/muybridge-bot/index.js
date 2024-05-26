const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");
const path = require("path");

ffmpeg.setFfprobePath(ffprobeStatic.path);

module.exports = async ({ ack, body, view, client }) => {
  return "will do this later (Muybridge bot)";
};

module.exports.muybridge = async (file) => {
  const fileExtension = path.extname(file).toLowerCase();
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];

  if (!videoExtensions.includes(fileExtension)) {
    throw new Error("The provided file is not a valid video format");
  }

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) {
        return reject(
          new Error(`Unable to analyze video file: ${err.message}`),
        );
      }

      const duration = metadata.format.duration;

      if (duration > 10) {
        return reject(new Error("The video file is longer than 10 seconds"));
      }

      return resolve(`launching muybridge to handle file ${file}`);
    });
  });
};
