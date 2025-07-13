import express from 'express';
import {
  createLadiesDay,
  voteLadiesDay,
  getLadiesDays,
  getTodaysLadiesDays
} from '../controllers/ladiesDayController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/ladies-days - Get ladies days with filters
router.get('/', getLadiesDays);

// GET /api/ladies-days/today - Get today's ladies days
router.get('/today', getTodaysLadiesDays);

// POST /api/ladies-days - Create new ladies day entry (authenticated)
router.post('/', authenticateToken, createLadiesDay);

// POST /api/ladies-days/:id/vote - Vote on ladies day entry (authenticated)
router.post('/:id/vote', authenticateToken, voteLadiesDay);

module.exports = router;