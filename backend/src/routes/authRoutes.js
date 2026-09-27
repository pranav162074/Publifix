import express from 'express';
import { registerUser, loginUser, googleAuth, getMe, deleteMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleAuth);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteMe);

export default router;