const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'pdf'],
  },
  published_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
