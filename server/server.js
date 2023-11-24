const express = require('express');
const multer = require('multer');
const { google } = require('googleapis')
require('dotenv').config();

// Nodemaile
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

const path = require('path')
const fs = require('fs')

const mime = require('mime-types');
const dataFilePath = path.join(__dirname, 'data.json');

let folderName;
let filePath; // Declare filePath at a higher scope

const timestamp = Date.now(); // Get the current timestamp

//These should be inside env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

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

// Function to read data from the file
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

console.log(folderName);

// Function to write data to the file
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};


// const pathName = path.join(__dirname, 'uploads', 'IMG_1847.JPG');

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function uploadFiles(res) {
    try {
        console.log("Trying to upload to drive.")

        const folderExists = await checkFolderExists(folderName);
        console.log(folderExists)

        if (!folderName) {
            console.log('Folder does not exist on Google Drive.');
            res.status(400).send('Folder does not exist on Google Drive.');
            return;
        }

        // Continue with the file upload to the existing folder
        const fileExtension = path.extname(filePath); // Get the file extension
        const dynamicMimeType = mime.lookup(fileExtension); // Get the MIME type based on the file extension

        console.log('Uploading to folder:', folderName);
        console.log('Folder ID:', [folderExists.id]);

        const response = await drive.files.create({
            requestBody: {
                name: `image_${timestamp}.jpg`,
                mimeType: dynamicMimeType,
                parents: [folderExists.id], // Use the folder ID as the parent
            },
            media: {
                mimeType: dynamicMimeType,
                body: fs.createReadStream(filePath)
            }
        });

        console.log(response.data);
        console.log('Image has been uploaded to Drive Successfully.');

        // Send success response to the frontend
        res.send('Image has been uploaded to Drive Successfully.');

    } catch (error) {
        console.log(error.message);
        // res.status(500).send('Internal Server Error');
    }
}


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

            // uploadFiles();
        },
    }),
});

async function checkFolderExists(folderName) {
    try {
        const response = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
            spaces: 'drive',
        });

        if (response.data.files.length > 0) {
            return response.data.files[0]; // Return the first matching folder
        } else {
            return null; // Return null if the folder does not exist
        }
    } catch (error) {
        console.error('Error checking folder existence:', error);
        return false;
    }
}

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, phone, email } = req.body;
    // Print the data received from React
    console.log('Received data from React:');
    console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Email:', email);

    // Use nodemailer to send email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // replace with your email
            pass: process.env.PASSWORD, // replace with your email password or app password
        }
    });

    const mailOptions = {
        from: "Snaps Capture",
        to: email,
        subject: 'Thank you for contacting us!',
        html: `
            <p>Dear ${name},</p>
            <p>Thank you for choosing our photo uploading service! We appreciate your trust in us.</p>
            <p>To proceed with obtaining your QR code, please follow the instructions below:</p>
            <p><strong>Payment Details:</strong></p>
            <p>The service fee for obtaining your QR code is Rs. 1000. You can make the payment through any secure payment gateway [eSewa, Khalti, IME Pay, etc.].</p>
            <p><strong>Payment Process:</strong></p>
            <ol>
                <li>Scan the attached QR code using your preferred payment app.</li>
                <li>Enter the amount as Rs. 1000.</li>
                <li>Confirm the payment.</li>
            </ol>
            <p><strong>Note:</strong> Please ensure that you use the payment details provided here to avoid any complications in the process.</p>
            <p><strong>Payment QR Code:</strong></p>
            <img src="cid:qrCodeImage" alt="Payment QR Code" />
            <p><strong>Next Steps:</strong></p>
            <p>Once the payment is successfully processed, our team will initiate the creation of your QR code for the photo uploading service. Please allow up to 8hrs for the process to be completed.</p>
            <p>We would like to express our gratitude for choosing our photo uploading service. We understand the importance of your time and trust, and we assure you that we are dedicated to providing you with a seamless experience.</p>
            <p><strong>Contact Information:</strong></p>
            <p>If you encounter any issues during the payment process or have any questions, feel free to reach out to us at kapalikkhanal@gmail.com or +977-9860364927. We are here to assist you.</p>
            <p>Thank you once again for choosing us. We look forward to serving you!</p>
            <p><strong>Best regards,</strong></p>
            <p>Kapalik Khanal<br> Snapscapture.com</p>
        `,
        attachments: [
            {
                filename: 'qrCode.jpg',
                path: './public/qrCode.jpg',
                cid: 'qrCodeImage',  // Set the content ID for the inline image
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully!');
        }
    });
});

// Handle form submission
app.post('/code', async (req, res) => {
    const { code } = req.body;
    // Print the data received from React
    console.log('Received data from React:');
    console.log('Code:', code);

    try {
        const folderExists = await checkFolderExists(code);
        console.log('Folder Exists:', folderExists);

        if (folderExists && folderExists.id) {
            console.log('Folder ID:', folderExists.id);
            console.log('Folder already exists on Google Drive.');
            res.status(200).send('Folder exists on Google Drive.');

            // Read existing data from the file
            folderName = code;
            console.log('folderName:', folderName);
        } else {
            console.log('Folder does not exist on Google Drive or ID is undefined.');
            res.status(404).send('Folder does not exist on Google Drive.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('File received:', req.file);
        await uploadFiles(res); // Pass the 'res' object to the 'uploadFiles' function
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


