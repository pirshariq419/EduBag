const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    default: '/images/logo.png'
  },
  type: {
    type: String,
    enum: ['pyq', 'syllabus', 'all'],
    default: 'all'
  },
  description: String,
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
