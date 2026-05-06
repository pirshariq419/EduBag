const Resource = require('../models/Resource');
const Test = require('../models/Test');
const Post = require('../models/Post');

// @desc    Global search across multiple collections
// @route   GET /api/search
// @access  Public
exports.globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({
        success: true,
        data: { resources: [], tests: [], posts: [] }
      });
    }

    const searchRegex = new RegExp(q, 'i');

    const [resources, tests, posts] = await Promise.all([
      Resource.find({
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { exam: searchRegex },
          { class: searchRegex }
        ]
      }).limit(10),

      Test.find({
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { exam: searchRegex }
        ]
      }).select('-questions').limit(10),

      Post.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { examCategory: searchRegex }
        ]
      }).populate('author', 'name').limit(10)
    ]);

    res.status(200).json({
      success: true,
      data: {
        resources,
        tests,
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};
