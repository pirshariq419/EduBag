const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  exam: { type: String, required: true },
  year: { type: Number },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  tags: [String],
  fileUrl: { type: String, required: true }, // Cloudinary URL
  downloads: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
