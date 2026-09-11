import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('photo'), createComplaint);
router.get('/mine', protect, getMyComplaints);
router.get('/', protect, admin, getAllComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', protect, admin, updateComplaintStatus);

export default router;