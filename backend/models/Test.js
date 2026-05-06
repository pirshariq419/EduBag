const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Full-Length', 'Chapter-wise', 'Subjective'], required: true },
  exam: { type: String },
  subject: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  generatedBy: { type: String, enum: ['manual', 'ai'], default: 'manual' },
  durationMinutes: { type: Number, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    explanation: String
  }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Test', TestSchema);
