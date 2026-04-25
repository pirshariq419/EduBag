const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['pyq', 'syllabus'],
    required: [true, 'Please specify resource type']
  },
  exam: {
    type: String,
    required: [true, 'Please specify the exam (e.g. JKBOSE, NEET)']
  },
  class: {
    type: String
  },
  year: {
    type: Number
  },
  subject: {
    type: String
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add a file URL']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
