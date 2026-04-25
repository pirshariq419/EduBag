const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  toggleUpvotePost,
  addComment,
  deleteComment
} = require('../controllers/forum');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Post Routes
router.route('/posts')
  .get(getPosts)
  .post(protect, createPost);

router.route('/posts/:id')
  .get(getPost)
  .delete(protect, deletePost);

router.route('/posts/:id/upvote')
  .put(protect, toggleUpvotePost);

// Comment Routes
router.route('/posts/:id/comments')
  .post(protect, addComment);

router.route('/comments/:id')
  .delete(protect, deleteComment);

module.exports = router;
