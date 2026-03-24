const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['resume', 'certificate', 'project_proof'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  filePath: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: { type: String },
  fileSize: { type: Number },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  staffComment: { type: String },
  verifiedAt: { type: Date }
}, {
  timestamps: true
});

DocumentSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Document', DocumentSchema);
