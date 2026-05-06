const express = require('express');
const { generateAIQuestions, eduBotChat } = require('../controllers/ai');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/generate-questions')
  .post(protect, authorize('admin'), generateAIQuestions);

router.route('/chat')
  .post(protect, eduBotChat);

module.exports = router;
