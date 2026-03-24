const mongoose = require('mongoose');

const VacancySchema = new mongoose.Schema({
  role: { type: String, required: true },
  requiredSkills: [{ type: String }],
  filled: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 2000
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  maxMembers: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['Not Started', 'Ongoing', 'Completed'],
    default: 'Not Started'
  },
  level: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  vacancies: [VacancySchema],
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    isSenior: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now }
  }],
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  archived: {
    type: Boolean,
    default: false
  },
  archivedAt: { type: Date },
  outcomes: { type: String },
  teamSummary: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current member count
ProjectSchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

// Virtual for available vacancies
ProjectSchema.virtual('vacancyCount').get(function () {
  return this.vacancies ? this.vacancies.filter(v => !v.filled).length : 0;
});

// Index for search
ProjectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
