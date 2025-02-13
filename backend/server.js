require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const VIDNOZ_API_KEY = process.env.VIDNOZ_API_KEY;

app.use(cors());
app.use(express.json());

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/generate-headshot", upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const response = await axios.post(
            "https://devapi.vidnoz.com/v2/task/ai-headshots",
            {
                file: req.file.buffer.toString("base64"), // Convert file to Base64
            },
            {
                headers: {
                    "Authorization": `Bearer ${VIDNOZ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Vidnoz API Response:", response.data);

        if (response.data.code !== 200) {
            return res.status(400).json({ error: "Failed to generate headshot" });
        }

        res.json({ task_id: response.data.data.task_id });
    } catch (error) {
        console.error("Error generating headshot:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
