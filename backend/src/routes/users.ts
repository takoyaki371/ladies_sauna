import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/users/favorites - Get user's favorite saunas
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        sauna: {
          include: {
            ladiesDays: {
              where: {
                OR: [
                  { dayOfWeek: new Date().getDay() },
                  { specificDate: new Date() }
                ]
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const favoriteSaunas = favorites.map(fav => ({
      ...fav.sauna,
      isFavorited: true,
      favoriteId: fav.id,
      hasLadiesDay: fav.sauna.ladiesDays.length > 0
    }));

    res.json({
      favorites: favoriteSaunas
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;