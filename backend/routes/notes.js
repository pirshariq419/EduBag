const express = require('express');
const { getNotes, getNote, createNote, updateNote, deleteNote } = require('../controllers/notes');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getNotes)
  .post(protect, authorize('admin'), createNote);

router.route('/:id')
  .get(getNote)
  .put(protect, authorize('admin'), updateNote)
  .delete(protect, authorize('admin'), deleteNote);

module.exports = router;
