const express = require("express");
const cors = require("cors");
const youtubedl = require("yt-dlp-exec");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());


// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ---------------- VIDEO INFO ----------------
app.get("/info", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({
        error: "No URL provided",
      });
    }

    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader,
      webpage_url: info.webpage_url,
    });

  } catch (err) {
    console.log("INFO ERROR:", err.message);

    res.status(500).json({
      error: "Failed to fetch video info",
    });
  }
});


// ---------------- DOWNLOAD VIDEO ----------------
app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({
        error: "No URL provided",
      });
    }

    // create downloads folder
    const downloadsDir = path.join(__dirname, "downloads");

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const timestamp = Date.now();

    const fileName = `video-${timestamp}.mp4`;

    const outputPath = path.join(downloadsDir, fileName);

    console.log("Starting download:", url);

    // download + merge
    await youtubedl(url, {
      format: "bestvideo+bestaudio/best",
      mergeOutputFormat: "mp4",
      output: outputPath,
      noWarnings: true,
    });

    console.log("Download complete");

    // set headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.setHeader("Content-Type", "video/mp4");

    // stream file
    const fileStream = fs.createReadStream(outputPath);

    fileStream.pipe(res);

    // cleanup after sending
    fileStream.on("close", () => {
      fs.unlink(outputPath, (err) => {
        if (err) {
          console.log("Cleanup error:", err.message);
        }
      });
    });

  } catch (err) {
    console.log("DOWNLOAD ERROR:", err.message);

    res.status(500).json({
      error: "Download failed or site unsupported",
    });
  }
});


// ---------------- START SERVER ----------------
const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});