import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('photo'), createComplaint);
router.get('/mine', protect, getMyComplaints);
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', protect, updateComplaintStatus);

export default router;