const express = require('express');
const { uploadFile, uploadMiddleware } = require('../controllers/uploads');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, uploadMiddleware, uploadFile);

module.exports = router;
