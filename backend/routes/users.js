const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/staff
// @desc    Get all staff members
// @access  Public
router.get('/staff', async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { role: 'staff' };
    if (department) filter.department = department;

    const staff = await User.find(filter).select('-password');
    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/staff/:id
// @desc    Get single staff profile
// @access  Public
router.get('/staff/:id', async (req, res) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, role: 'staff' }).select('-password');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Get projects managed by this staff
    const projects = await Project.find({ staff: staff._id })
      .select('name status level department memberCount')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { ...staff.toObject(), projects } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/students
// @desc    Get all students
// @access  Private (Staff only)
router.get('/students', protect, authorize('staff'), async (req, res) => {
  try {
    const { department, year } = req.query;
    const filter = { role: 'student' };
    if (department) filter.department = department;
    if (year) filter.year = parseInt(year);

    const students = await User.find(filter).select('-password');
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/student/:id
// @desc    Get student profile
// @access  Public
router.get('/student/:id', async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get projects the student is a member of
    const projects = await Project.find({ 'members.user': student._id })
      .select('name status level department members')
      .populate('staff', 'name')
      .sort({ createdAt: -1 });

    // Get archived projects for showcase
    const archivedProjects = await Project.find({
      'members.user': student._id,
      archived: true
    }).select('name description outcomes teamSummary archivedAt department')
      .sort({ archivedAt: -1 });

    // Suggest best fit role based on most requested / assigned role
    const RoleRequest = require('../models/RoleRequest');
    const roleRequests = await RoleRequest.find({ student: student._id, status: 'approved' });
    const roleCounts = {};
    roleRequests.forEach(r => {
      roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
    });
    const bestFitRole = Object.keys(roleCounts).sort((a, b) => roleCounts[b] - roleCounts[a])[0] || student.preferredRole || 'Not determined';

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        projects,
        archivedProjects,
        bestFitRole
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update own profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'department', 'photo', 'bio',
      // Student fields
      'studentId', 'rollNumber', 'year', 'languages', 'preferredRole',
      // Staff fields
      'cabinNumber', 'floor', 'yearsExperience', 'linkedIn', 'contactNumber', 'availability', 'timeSlots'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/availability
// @desc    Update staff availability status and time slots
// @access  Private (Staff only)
router.put('/availability', protect, authorize('staff'), async (req, res) => {
  try {
    const { availability, timeSlots } = req.body;
    const updateData = {};

    if (availability) {
      if (!['Available', 'Busy', 'Not Interested'].includes(availability)) {
        return res.status(400).json({ success: false, message: 'Invalid availability status' });
      }
      updateData.availability = availability;
    }

    if (timeSlots !== undefined) {
      updateData.timeSlots = timeSlots;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
