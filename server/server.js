const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');

const path = require('path')
const fs = require('fs')

const mime = require('mime-types');


let filePath; // Declare filePath at a higher scope

const { v4: uuidv4 } = require('uuid');
const { file } = require('googleapis/build/src/apis/file');

const app = express();
const port = 3001;

const timestamp = Date.now(); // Get the current timestamp

//These should be inside env
const CLIENT_ID = '1057607245904-a1apulb89ssp4is96sgg5mqlia0kbgq5.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const REFRESH_TOKEN = '1//04l64UaFDFdO6CgYIARAAGAQSNwF-L9IrxNYEEqvsaVn4Funmy7P7zacVPkMo5Q6oZS2bF62dkau5cGSw-uxmTbIeCpBEwnDOLxQ'

const ouath2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

ouath2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: ouath2Client
})

// const pathName = path.join(__dirname, 'uploads', 'IMG_1847.JPG');

async function uploadFiles() {
    try {
        console.log("Trying to upload to drive.")
        const fileExtension = path.extname(filePath); // Get the file extension
        const dynamicMimeType = mime.lookup(fileExtension); // Get the MIME type based on the file extension

        const response = await drive.files.create({

            requestBody: {
                name: `image_${timestamp}.jpg`,
                mimeType: dynamicMimeType
            },
            media: {
                mimeType: dynamicMimeType,
                body: fs.createReadStream(filePath)
            }
        });
        console.log(response.data);
        console.log('Image has been uploaded to Drive Successfully.')
    } catch (error) {
        console.log(error.message)
    }
}

// uploadFiles();

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Specify the directory where you want to store the files
        },
        filename: function (req, file, cb) {
            // Create a unique pathname using uuid
            //const uniqueFilename = `${uuidv4()}-${file.originalname}`;
            const uniqueFilename = `${file.originalname}`;
            cb(null, uniqueFilename);

            filePath = path.join(__dirname, 'uploads', uniqueFilename);

            uploadFiles();
        },
    }),
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('File received:', req.file);
        console.log("Image Upload Successful.");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
