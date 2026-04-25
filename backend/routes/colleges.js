const express = require('express');
const { getColleges, getCollege, createCollege, addReview, updateCollege, deleteCollege } = require('../controllers/colleges');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getColleges)
  .post(protect, authorize('admin'), createCollege);

router.route('/:id')
  .get(getCollege)
  .put(protect, authorize('admin'), updateCollege)
  .delete(protect, authorize('admin'), deleteCollege);

router.post('/:id/reviews', protect, addReview);

module.exports = router;
