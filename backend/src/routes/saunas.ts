import express from 'express';
import {
  getSaunas,
  getSauna,
  createSauna,
  toggleFavorite
} from '../controllers/saunaController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/saunas - Get all saunas with optional filters
router.get('/', optionalAuth, getSaunas);

// GET /api/saunas/:id - Get single sauna
router.get('/:id', optionalAuth, getSauna);

// POST /api/saunas - Create new sauna (authenticated)
router.post('/', authenticateToken, createSauna);

// POST /api/saunas/:id/favorite - Toggle favorite (authenticated)
router.post('/:id/favorite', authenticateToken, toggleFavorite);

module.exports = router;