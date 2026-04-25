const Note = require('../models/Note');
const ErrorResponse = require('../utils/errorResponse');

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find(req.query);
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return next(new ErrorResponse('Note not found', 404));
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    req.body.uploadedBy = req.user.id;
    const note = await Note.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) return next(new ErrorResponse('Note not found', 404));

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return next(new ErrorResponse('Note not found', 404));

    await note.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
