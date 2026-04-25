const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: String,
  websiteUrl: String,
  description: String,
  courses: [{
    name: String,
    duration: String,
    fees: Number
  }],
  cutoffs: [{
    year: Number,
    exam: String,
    rank: Number
  }],
  placementData: {
    averagePackage: String,
    highestPackage: String,
    topRecruiters: [String]
  },
  reviews: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('College', CollegeSchema);
