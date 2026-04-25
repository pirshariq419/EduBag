const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.ObjectId,
    ref: 'Test',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  skippedQuestions: {
    type: Number,
    required: true
  },
  answers: [Number], // The student's selected indices
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', ResultSchema);
