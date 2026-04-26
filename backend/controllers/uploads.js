const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Disk Storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanName = file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix + '-' + cleanName);
  }
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

  // Construct local URL. 
  // In development: http://localhost:5000/uploads/...
  // In production: https://your-render-url.com/uploads/...
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: fileUrl
  });
};

exports.uploadMiddleware = upload.single('file');
