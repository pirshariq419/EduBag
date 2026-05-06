const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use Memory Storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

exports.uploadFile = async (req, res) => {
  console.log('!!! [BACKEND] RAW UPLOAD START !!!');
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    // Construct the data URI
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    console.log('Uploading as RAW to bypass validation...');
    
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'edubag_uploads',
      // Using 'raw' forces Cloudinary to accept the file without validating its content
      resource_type: 'raw',
      public_id: Date.now() + '-' + req.file.originalname.replace(/\s+/g, '-'),
    });

    console.log('SUCCESS! Raw URL:', uploadResponse.secure_url);

    res.status(200).json({
      success: true,
      data: uploadResponse.secure_url
    });
  } catch (err) {
    console.error('FINAL CLOUDINARY ERROR:', err);
    res.status(500).json({ 
      success: false, 
      error: `Cloudinary rejected the file: ${err.message}` 
    });
  }
};

exports.uploadMiddleware = upload.single('file');
