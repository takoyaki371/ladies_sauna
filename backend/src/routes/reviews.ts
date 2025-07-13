import express from 'express';
import {
  createReview,
  getReviews,
  getUserReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/reviews - Get reviews with optional filters
router.get('/', getReviews);

// GET /api/reviews/me - Get current user's reviews
router.get('/me', authenticateToken, getUserReviews);

// POST /api/reviews - Create new review (authenticated)
router.post('/', authenticateToken, createReview);

// PUT /api/reviews/:id - Update review (authenticated, owner only)
router.put('/:id', authenticateToken, updateReview);

// DELETE /api/reviews/:id - Delete review (authenticated, owner only)
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;