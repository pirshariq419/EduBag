const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all posts
// @route   GET /api/forum/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const { category, sort } = req.query;
    let query = {};
    if (category && category !== 'all') {
      query.examCategory = category;
    }

    let sortObj = { createdAt: -1 }; // Default: Newest
    if (sort === 'popular') {
      sortObj = { upvotes: -1, commentCount: -1 };
    }

    const posts = await Post.find(query)
      .populate('author', 'name profilePic')
      .sort(sortObj);
      
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post with comments
// @route   GET /api/forum/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic');
      
    if (!post) return next(new ErrorResponse('Post not found', 404));

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json({ 
      success: true, 
      data: { post, comments } 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/forum/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post (Admin only or post author)
// @route   DELETE /api/forum/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorResponse('Post not found', 404));

    // Make sure user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this post', 401));
    }

    await Comment.deleteMany({ post: post._id }); // Delete associated comments
    await post.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote/Downvote post
// @route   PUT /api/forum/posts/:id/upvote
// @access  Private
exports.toggleUpvotePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorResponse('Post not found', 404));

    const upvoteIndex = post.upvotes.indexOf(req.user.id);
    if (upvoteIndex !== -1) {
      // Already upvoted, so remove it (downvote/un-upvote)
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      post.upvotes.push(req.user.id);
    }

    await post.save();
    res.status(200).json({ success: true, data: post.upvotes.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment
// @route   POST /api/forum/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    req.body.post = req.params.id;
    req.body.author = req.user.id;

    const post = await Post.findById(req.params.id);
    if (!post) return next(new ErrorResponse('Post not found', 404));

    const comment = await Comment.create(req.body);
    
    // Fetch populated comment
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name profilePic');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment (Admin only or comment author)
// @route   DELETE /api/forum/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(new ErrorResponse('Comment not found', 404));

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this comment', 401));
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
