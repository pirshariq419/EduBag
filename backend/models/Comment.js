const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a comment']
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Update comment count on post when a comment is added/removed
CommentSchema.post('save', async function() {
  await mongoose.model('Post').findByIdAndUpdate(this.post, {
    $inc: { commentCount: 1 }
  });
});

CommentSchema.post('deleteOne', { document: true, query: false }, async function() {
  await mongoose.model('Post').findByIdAndUpdate(this.post, {
    $inc: { commentCount: -1 }
  });
});

module.exports = mongoose.model('Comment', CommentSchema);
