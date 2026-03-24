const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    maxlength: 2000
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  }
}, {
  timestamps: true
});

ChatMessageSchema.index({ project: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
