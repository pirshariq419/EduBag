const Resource = require('../models/Resource');
const ErrorResponse = require('../utils/errorResponse');

exports.getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find(req.query);
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!resource) return next(new ErrorResponse('Resource not found', 404));
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return next(new ErrorResponse('Resource not found', 404));
    await resource.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
