require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Google OAuth2 setup
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {

  try {
    const filePath = path.join(__dirname, req.file.path);
    console.log(filePath);
    
    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname, // Keep the original file name
        mimeType: req.file.mimetype,
        parents: ["1i_C_WKe6qdQ3XypAgQ4A2naNK_i8Coog"]
      },
      media: {
        body: fs.createReadStream(filePath),
      },
      fields: 'id, webViewLink, webContentLink',
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      fileId: response.data.id,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    });
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
