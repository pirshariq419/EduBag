const express = require('express');
const { 
  getTests, getTest, createTest, updateTest, deleteTest, submitTest, getTestResults 
} = require('../controllers/tests');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTests)
  .post(protect, authorize('admin'), createTest);

router.route('/:id')
  .get(protect, getTest) // Needs protection to verify if user is allowed to take it
  .put(protect, authorize('admin'), updateTest)
  .delete(protect, authorize('admin'), deleteTest);

router.route('/:id/submit')
  .post(protect, submitTest);

router.route('/:id/results')
  .get(protect, getTestResults);

module.exports = router;
