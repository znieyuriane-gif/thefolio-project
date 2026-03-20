// backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post',    required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  body:    { type: String, required: true, trim: true },
  image:   { type: String, default: '' },  // optional image attached to comment
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // if replying to a comment
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);