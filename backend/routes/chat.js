const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/chat/:projectId
// @desc    Get all messages for a project discussion
// @access  Private
router.get('/:projectId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { page = 1, limit = 50 } = req.query;
    const messages = await ChatMessage.find({ project: req.params.projectId })
      .populate('user', 'name photo role department')
      .populate('parentMessage', 'message user')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ChatMessage.countDocuments({ project: req.params.projectId });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chat/:projectId
// @desc    Post a message in project discussion
// @access  Private
router.post('/:projectId', protect, [
  body('message').notEmpty().withMessage('Message cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const chatMessage = await ChatMessage.create({
      project: req.params.projectId,
      user: req.user.id,
      message: req.body.message,
      parentMessage: req.body.parentMessage || null
    });

    await chatMessage.populate('user', 'name photo role department');

    res.status(201).json({ success: true, data: chatMessage });
  } catch (error) {
    console.error('Post chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/chat/message/:id
// @desc    Delete own message
// @access  Private
router.delete('/message/:id', protect, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    if (message.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }
    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
