const College = require('../models/College');
const ErrorResponse = require('../utils/errorResponse');

exports.getColleges = async (req, res, next) => {
  try {
    const colleges = await College.find(req.query);
    res.status(200).json({ success: true, count: colleges.length, data: colleges });
  } catch (error) {
    next(error);
  }
};

exports.getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return next(new ErrorResponse('College not found', 404));
    res.status(200).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.createCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const college = await College.findById(req.params.id);
    if (!college) return next(new ErrorResponse('College not found', 404));

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    college.reviews.push(review);
    await college.save();

    res.status(201).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!college) return next(new ErrorResponse('College not found', 404));
    res.status(200).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return next(new ErrorResponse('College not found', 404));
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
