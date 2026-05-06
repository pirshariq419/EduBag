const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary-v2');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    
    return {
      folder: 'edubag_uploads',
      // We use 'image' for PDFs because Cloudinary provides better 
      // CORS headers and PDF features when handled as an image resource.
      resource_type: isPdf ? 'image' : 'auto', 
      public_id: Date.now() + '-' + file.originalname.replace(/\s+/g, '-').replace(/\.[^/.]+$/, ""),
      // Force PDF format to ensure the URL ends in .pdf
      format: isPdf ? 'pdf' : undefined,
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|png|jpg|jpeg/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only documents and images are allowed'));
  }
});

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a file' });
  }

  // Use secure_url to prevent mixed-content blocks in browsers
  const fileUrl = req.file.secure_url || req.file.path;

  res.status(200).json({
    success: true,
    data: fileUrl
  });
};

exports.uploadMiddleware = upload.single('file');
