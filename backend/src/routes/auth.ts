import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

module.exports = router;