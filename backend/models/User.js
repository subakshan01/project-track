const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'staff'],
    required: true
  },
  // Student-specific fields
  studentId: { type: String, sparse: true },
  rollNumber: { type: String, sparse: true },
  year: { type: Number, min: 1, max: 5 },
  languages: [{ type: String }],
  preferredRole: { type: String },
  bestFitRole: { type: String },
  // Staff-specific fields
  cabinNumber: { type: String },
  floor: { type: String },
  yearsExperience: { type: Number },
  linkedIn: { type: String },
  contactNumber: { type: String },
  timeSlots: [{ type: String }],
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Not Interested'],
    default: 'Available'
  },
  // Common fields
  department: { type: String },
  photo: { type: String, default: '' },
  bio: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || 'a_very_secret_fallback_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Match entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
