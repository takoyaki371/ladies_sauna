import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getSaunas = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 5, 
      hasLadiesDay, 
      facilities,
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    let whereClause: any = {};

    // Search by name or address (temporarily disabled for debugging)
    if (search && search.length > 0) {
      // Simple search - just log for now
      console.log('Search term:', search);
      // For now, don't filter to see if basic API works
    }

    // Filter by ladies day availability
    if (hasLadiesDay === 'true') {
      whereClause.ladiesDays = {
        some: {}
      };
    }

    // Filter by facilities
    if (facilities) {
      const facilityArray = (facilities as string).split(',');
      whereClause.facilities = {
        some: {
          name: {
            in: facilityArray
          }
        }
      };
    }

    const saunas = await prisma.sauna.findMany({
      where: whereClause,
      include: {
        facilities: true,
        ladiesDays: {
          include: {
            votes: true,
            sourceUser: {
              select: {
                username: true,
                trustScore: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      },
      skip: offset,
      take: limitNumber,
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ]
    });

    // Calculate distance if coordinates provided
    let saunasWithDistance = saunas;
    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      
      saunasWithDistance = saunas.map(sauna => ({
        ...sauna,
        distance: calculateDistance(userLat, userLng, sauna.latitude, sauna.longitude)
      })).sort((a, b) => a.distance - b.distance);
    }

    const total = await prisma.sauna.count({ where: whereClause });

    res.json({
      saunas: saunasWithDistance,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get saunas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSauna = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const sauna = await prisma.sauna.findUnique({
      where: { id },
      include: {
        facilities: true,
        ladiesDays: {
          include: {
            votes: true,
            sourceUser: {
              select: {
                username: true,
                trustScore: true
              }
            }
          },
          orderBy: {
            trustScore: 'desc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
                trustScore: true
              }
            }
          },
          where: {
            visibility: 'PUBLIC'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    });

    if (!sauna) {
      return res.status(404).json({ message: 'Sauna not found' });
    }

    // Check if user has favorited this sauna
    let isFavorited = false;
    if (req.user) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_saunaId: {
            userId: req.user.id,
            saunaId: id
          }
        }
      });
      isFavorited = !!favorite;
    }

    res.json({
      ...sauna,
      isFavorited
    });
  } catch (error) {
    console.error('Get sauna error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSauna = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      phone,
      website,
      description,
      priceRange,
      facilities
    } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude || !priceRange) {
      return res.status(400).json({ 
        message: 'Name, address, coordinates, and price range are required' 
      });
    }

    const sauna = await prisma.sauna.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        phone,
        website,
        description,
        priceRange,
        facilities: facilities ? {
          create: facilities.map((facility: any) => ({
            name: facility.name,
            category: facility.category,
            temperature: facility.temperature,
            description: facility.description,
            isWomenOnly: facility.isWomenOnly || false
          }))
        } : undefined
      },
      include: {
        facilities: true
      }
    });

    res.status(201).json({
      message: 'Sauna created successfully',
      sauna
    });
  } catch (error) {
    console.error('Create sauna error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if sauna exists
    const sauna = await prisma.sauna.findUnique({
      where: { id }
    });

    if (!sauna) {
      return res.status(404).json({ message: 'Sauna not found' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_saunaId: {
          userId,
          saunaId: id
        }
      }
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_saunaId: {
            userId,
            saunaId: id
          }
        }
      });

      res.json({
        message: 'Favorite removed',
        isFavorited: false
      });
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          saunaId: id
        }
      });

      res.json({
        message: 'Favorite added',
        isFavorited: true
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}