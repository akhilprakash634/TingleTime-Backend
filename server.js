require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// API Route to generate pre-signed URL
app.post('/generate-presigned-url', (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: 'File name is required' });
  }

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `dialogues/${fileName}`,
    Expires: 60, // seconds
    ContentType: 'audio/mpeg'
  };

  const uploadUrl = s3.getSignedUrl('putObject', params);
  const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/dialogues/${fileName}`;

  res.json({
    uploadUrl,
    fileUrl
  });
});

app.listen(port, () => {
  console.log(`TingleTime backend running on http://localhost:${port}`);
});
