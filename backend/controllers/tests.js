const Test = require('../models/Test');
const Result = require('../models/Result');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
exports.getTests = async (req, res, next) => {
  try {
    const { exam } = req.query;
    const query = exam ? { exam: { $regex: new RegExp(exam, 'i') } } : {};
    
    // Do not return the correct answers or explanations in the list view
    const tests = await Test.find(query).select('-questions.correctAnswerIndex -questions.explanation').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tests.length, data: tests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single test (for taking the test)
// @route   GET /api/tests/:id
// @access  Private
exports.getTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return next(new ErrorResponse('Test not found', 404));

    // Strip answers if not admin (so students can't cheat)
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!isAdmin) {
      const sanitizedTest = test.toObject();
      sanitizedTest.questions.forEach(q => {
        delete q.correctAnswerIndex;
        delete q.explanation;
      });
      return res.status(200).json({ success: true, data: sanitizedTest });
    }

    res.status(200).json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new test
// @route   POST /api/tests
// @access  Private/Admin
exports.createTest = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
};

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin
exports.updateTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!test) return next(new ErrorResponse('Test not found', 404));
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
exports.deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return next(new ErrorResponse('Test not found', 404));
    await test.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a test and calculate score
// @route   POST /api/tests/:id/submit
// @access  Private
exports.submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selected indices, matching question order
    const test = await Test.findById(req.params.id);

    if (!test) return next(new ErrorResponse('Test not found', 404));

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedQuestions = 0;
    const totalQuestions = test.questions.length;

    test.questions.forEach((q, index) => {
      const selectedIndex = answers[index];
      if (selectedIndex === null || selectedIndex === undefined || selectedIndex === -1) {
        skippedQuestions++;
      } else if (selectedIndex === q.correctAnswerIndex) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    // Score can be customized (e.g. +4 for correct, -1 for wrong). Keeping simple here.
    const score = correctAnswers;

    const result = await Result.create({
      user: req.user.id,
      test: test._id,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      answers
    });

    // Return the result AND the full test with explanations so the frontend can show analysis
    res.status(201).json({
      success: true,
      data: {
        result,
        test // Includes correct answers and explanations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get results for a specific test for the logged in user
// @route   GET /api/tests/:id/results
// @access  Private
exports.getTestResults = async (req, res, next) => {
  try {
    const results = await Result.find({ test: req.params.id, user: req.user.id }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};
