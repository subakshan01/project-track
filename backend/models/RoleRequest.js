const mongoose = require('mongoose');

const RoleRequestSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vacancyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  experienceDescription: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComment: { type: String },
  reviewedAt: { type: Date }
}, {
  timestamps: true
});

// Prevent duplicate requests for the same vacancy
RoleRequestSchema.index({ project: 1, student: 1, vacancyId: 1 }, { unique: true });

module.exports = mongoose.model('RoleRequest', RoleRequestSchema);
