const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Project = require('../models/Project');
const RoleRequest = require('../models/RoleRequest');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects with search & filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, department, status, level, role, archived } = req.query;
    let filter = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (level) filter.level = level;
    if (archived === 'true') {
      filter.archived = true;
    } else {
      filter.archived = { $ne: true };
    }
    if (role) {
      filter['vacancies.role'] = { $regex: role, $options: 'i' };
    }

    const projects = await Project.find(filter)
      .populate('staff', 'name email department photo availability')
      .populate('members.user', 'name email photo department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/projects/my/requests
// @desc    Get current student's role requests
// @access  Private (Student)
// NOTE: Must be defined BEFORE /:id to prevent Express matching 'my' as an id
router.get('/my/requests', protect, authorize('student'), async (req, res) => {
  try {
    const requests = await RoleRequest.find({ student: req.user.id })
      .populate('project', 'name status level department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('staff', 'name email department photo availability timeSlots cabinNumber floor contactNumber linkedIn yearsExperience')
      .populate('members.user', 'name email photo department studentId rollNumber')
      .populate('vacancies.assignedTo', 'name email photo');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Staff only)
router.post('/', protect, authorize('staff'), [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('maxMembers').isInt({ min: 1 }).withMessage('Max members must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.staff = req.user.id;
    const project = await Project.create(req.body);

    // Notify all students about the new project
    const User = require('../models/User');
    const students = await User.find({ role: 'student' });
    const notifications = students.map(s => ({
      user: s._id,
      type: 'new_project',
      title: 'New Project Posted',
      message: `A new project "${project.name}" has been posted in ${project.department}`,
      project: project._id,
      link: `/projects/${project._id}`
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    await project.populate('staff', 'name email department photo');
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Staff only)
router.put('/:id', protect, authorize('staff'), async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const oldStatus = project.status;
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('staff', 'name email department photo')
      .populate('members.user', 'name email photo department');

    // Notify members if status changed
    if (req.body.status && req.body.status !== oldStatus) {
      const notifications = project.members.map(m => ({
        user: m.user._id,
        type: 'project_status_updated',
        title: 'Project Status Updated',
        message: `Project "${project.name}" status changed to ${req.body.status}`,
        project: project._id,
        link: `/projects/${project._id}`
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    // Handle archiving
    if (req.body.status === 'Completed' && !project.archived) {
      project.archived = true;
      project.archivedAt = new Date();
      await project.save();
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Staff only)
router.delete('/:id', protect, authorize('staff'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/request-role
// @desc    Student requests a role in a project
// @access  Private (Student only)
router.post('/:id/request-role', protect, authorize('student'), [
  body('vacancyId').notEmpty().withMessage('Vacancy ID is required'),
  body('experienceDescription').notEmpty().withMessage('Experience description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const vacancy = project.vacancies.id(req.body.vacancyId);
    if (!vacancy) {
      return res.status(404).json({ success: false, message: 'Vacancy not found' });
    }
    if (vacancy.filled) {
      return res.status(400).json({ success: false, message: 'This vacancy is already filled' });
    }

    // Check if student already requested this vacancy
    const existing = await RoleRequest.findOne({
      project: project._id,
      student: req.user.id,
      vacancyId: req.body.vacancyId
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already requested this role' });
    }

    const roleRequest = await RoleRequest.create({
      project: project._id,
      student: req.user.id,
      vacancyId: req.body.vacancyId,
      role: vacancy.role,
      experienceDescription: req.body.experienceDescription
    });

    // Notify the staff
    await Notification.create({
      user: project.staff,
      type: 'general',
      title: 'New Role Request',
      message: `${req.user.name} has requested the role "${vacancy.role}" in project "${project.name}"`,
      project: project._id,
      link: `/projects/${project._id}`
    });

    res.status(201).json({ success: true, data: roleRequest });
  } catch (error) {
    console.error('Request role error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/projects/:id/requests
// @desc    Get all role requests for a project
// @access  Private (Staff)
router.get('/:id/requests', protect, authorize('staff'), async (req, res) => {
  try {
    const requests = await RoleRequest.find({ project: req.params.id })
      .populate('student', 'name email photo department studentId rollNumber year languages preferredRole')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/projects/:projectId/requests/:requestId
// @desc    Approve or reject a role request
// @access  Private (Staff only)
router.put('/:projectId/requests/:requestId', protect, authorize('staff'), async (req, res) => {
  try {
    const { status, reviewComment } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const roleRequest = await RoleRequest.findById(req.params.requestId);
    if (!roleRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    roleRequest.status = status;
    roleRequest.reviewedBy = req.user.id;
    roleRequest.reviewComment = reviewComment || '';
    roleRequest.reviewedAt = new Date();
    await roleRequest.save();

    if (status === 'approved') {
      // Add student to project members
      const project = await Project.findById(req.params.projectId);
      project.members.push({
        user: roleRequest.student,
        role: roleRequest.role
      });
      // Mark vacancy as filled
      const vacancy = project.vacancies.id(roleRequest.vacancyId);
      if (vacancy) {
        vacancy.filled = true;
        vacancy.assignedTo = roleRequest.student;
      }
      await project.save();

      // Reject other requests for same vacancy
      await RoleRequest.updateMany(
        {
          project: req.params.projectId,
          vacancyId: roleRequest.vacancyId,
          _id: { $ne: roleRequest._id },
          status: 'pending'
        },
        {
          status: 'rejected',
          reviewedBy: req.user.id,
          reviewComment: 'Vacancy filled by another student',
          reviewedAt: new Date()
        }
      );
    }

    // Notify student
    await Notification.create({
      user: roleRequest.student,
      type: status === 'approved' ? 'role_approved' : 'role_rejected',
      title: status === 'approved' ? 'Role Approved!' : 'Role Request Rejected',
      message: status === 'approved'
        ? `Your request for role "${roleRequest.role}" has been approved!`
        : `Your request for role "${roleRequest.role}" has been rejected. ${reviewComment || ''}`,
      project: roleRequest.project,
      link: `/projects/${roleRequest.project}`
    });

    res.json({ success: true, data: roleRequest });
  } catch (error) {
    console.error('Review request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Remove a member from a project
// @access  Private (Staff only)
router.delete('/:id/members/:memberId', protect, authorize('staff'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const memberIndex = project.members.findIndex(
      m => m.user.toString() === req.params.memberId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found in project' });
    }

    const removedMember = project.members[memberIndex];
    project.members.splice(memberIndex, 1);

    // Un-fill the vacancy if applicable
    const vacancy = project.vacancies.find(
      v => v.assignedTo && v.assignedTo.toString() === req.params.memberId
    );
    if (vacancy) {
      vacancy.filled = false;
      vacancy.assignedTo = undefined;
    }

    await project.save();

    // Notify the removed member
    await Notification.create({
      user: req.params.memberId,
      type: 'general',
      title: 'Removed from Project',
      message: `You have been removed from project "${project.name}"`,
      project: project._id
    });

    const updated = await Project.findById(req.params.id)
      .populate('members.user', 'name email photo department studentId rollNumber');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id/members/:memberId/senior
// @desc    Toggle isSenior status for a project member
// @access  Private (Staff only)
router.put('/:id/members/:memberId/senior', protect, authorize('staff'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const member = project.members.find(
      m => m.user.toString() === req.params.memberId
    );
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found in project' });
    }

    member.isSenior = !member.isSenior;
    await project.save();

    // Notify the member
    await Notification.create({
      user: req.params.memberId,
      type: 'general',
      title: member.isSenior ? 'Promoted to Senior' : 'Senior Status Removed',
      message: member.isSenior
        ? `You have been promoted to senior member in project "${project.name}"`
        : `Your senior status in project "${project.name}" has been updated`,
      project: project._id
    });

    const updated = await Project.findById(req.params.id)
      .populate('members.user', 'name email photo department studentId rollNumber');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Toggle senior error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
