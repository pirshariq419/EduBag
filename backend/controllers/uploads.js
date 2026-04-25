const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary-v2');
const multer = require('multer');

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
    const type = req.body.type || 'others';
    const folder = `edubag/${type}`;
    
    // Determine format based on mimetype
    let format = 'png';
    if (file.mimetype === 'application/pdf') format = 'pdf';
    else if (file.mimetype === 'image/jpeg') format = 'jpg';
    else if (file.mimetype === 'image/png') format = 'png';

    return {
      folder: folder,
      format: format,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
    };
  },
});

const upload = multer({ 
  storage: storage,
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

  // With Cloudinary, the URL is in req.file.path
  const fileUrl = req.file.path;

  res.status(200).json({
    success: true,
    data: fileUrl
  });
};

exports.uploadMiddleware = upload.single('file');
