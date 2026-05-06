const { generateQuestions, chatWithEduBot } = require('../services/gemini');
const ErrorResponse = require('../utils/errorResponse');

// Simple in-memory rate limiter per admin user
const rateLimiter = new Map(); // userId -> { count, resetTime }
const RATE_LIMIT = 10; // max requests
const RATE_WINDOW = 60 * 1000; // per 60 seconds

function checkRateLimit(userId) {
  const now = Date.now();
  const entry = rateLimiter.get(userId);

  if (!entry || now > entry.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Allowed exam values
const ALLOWED_EXAMS = [
  'JKBOSE', 'NEET UG', 'NEET PG', 'JEE Mains', 'JEE Advanced',
  'JKBOPEE', 'CUET', 'SKAUST-K UET'
];

// @desc    Generate AI questions using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private/Admin
exports.generateAIQuestions = async (req, res, next) => {
  try {
    const { exam, subject, topic, count = 10, difficulty = 'Medium' } = req.body;

    // Input validation
    if (!exam || !subject) {
      return next(new ErrorResponse('Exam and subject are required.', 400));
    }

    if (!ALLOWED_EXAMS.includes(exam)) {
      return next(new ErrorResponse(`Invalid exam. Allowed: ${ALLOWED_EXAMS.join(', ')}`, 400));
    }

    if (typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 100) {
      return next(new ErrorResponse('Subject must be a non-empty string (max 100 chars).', 400));
    }

    if (topic && (typeof topic !== 'string' || topic.length > 200)) {
      return next(new ErrorResponse('Topic must be a string (max 200 chars).', 400));
    }

    const questionCount = Math.min(Math.max(parseInt(count) || 10, 5), 50);
    
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    const safeDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'Medium';

    // Rate limit check
    if (!checkRateLimit(req.user.id)) {
      return next(new ErrorResponse('Rate limit exceeded. Max 10 AI generations per minute. Please wait.', 429));
    }

    // Generate questions
    const questions = await generateQuestions(
      exam,
      subject.trim(),
      topic ? topic.trim() : null,
      questionCount,
      safeDifficulty
    );

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Chat with EduBot
// @route   POST /api/ai/chat
// @access  Private
exports.eduBotChat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return next(new ErrorResponse('Messages array is required.', 400));
    }

    // Rate limit check (using the same global rate limiter, or we could create a separate one. Let's use 20 requests per minute)
    if (!checkRateLimit(req.user.id)) {
      return next(new ErrorResponse('EduBot is resting. You are sending too many messages. Please wait a moment.', 429));
    }

    const responseText = await chatWithEduBot(messages, req.user);

    res.status(200).json({
      success: true,
      data: responseText
    });

  } catch (error) {
    next(error);
  }
};
