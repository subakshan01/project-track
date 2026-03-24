const express = require('express');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/documents/upload
// @desc    Upload a document
// @access  Private (Student only)
router.post('/upload', protect, authorize('student'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { type, title } = req.body;
    if (!type || !['resume', 'certificate', 'project_proof'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Valid document type is required (resume, certificate, project_proof)' });
    }
    if (!title) {
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }

    const document = await Document.create({
      user: req.user.id,
      type,
      title,
      filePath: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/documents/my
// @desc    Get current student's documents
// @access  Private (Student)
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/documents/student/:studentId
// @desc    Get a student's documents (for staff review)
// @access  Private (Staff)
router.get('/student/:studentId', protect, authorize('staff'), async (req, res) => {
  try {
    const documents = await Document.find({ user: req.params.studentId })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/documents/pending
// @desc    Get all pending documents for review
// @access  Private (Staff)
router.get('/pending', protect, authorize('staff'), async (req, res) => {
  try {
    const documents = await Document.find({ verificationStatus: 'pending' })
      .populate('user', 'name email studentId department')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/documents/:id/verify
// @desc    Verify or reject a document
// @access  Private (Staff only)
router.put('/:id/verify', protect, authorize('staff'), async (req, res) => {
  try {
    const { verificationStatus, staffComment } = req.body;
    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected' });
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        staffComment: staffComment || '',
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Notify student
    await Notification.create({
      user: document.user._id,
      type: verificationStatus === 'verified' ? 'document_verified' : 'document_rejected',
      title: verificationStatus === 'verified' ? 'Document Verified' : 'Document Rejected',
      message: verificationStatus === 'verified'
        ? `Your document "${document.title}" has been verified.`
        : `Your document "${document.title}" has been rejected. ${staffComment || ''}`,
      link: '/documents'
    });

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/documents/download/:id
// @desc    Download a document file
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Students can only download their own docs, staff can download any
    if (req.user.role === 'student' && document.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
