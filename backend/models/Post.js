const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  examCategory: {
    type: String,
    required: [true, 'Please select an exam category'],
    lowercase: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
