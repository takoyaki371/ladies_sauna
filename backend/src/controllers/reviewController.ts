import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const {
      saunaId,
      rating,
      title,
      content,
      visitDate,
      visibility = 'PUBLIC'
    } = req.body;

    const userId = req.user!.id;

    // Validation
    console.log('Review creation data:', { saunaId, rating, title, content, visitDate, visibility });
    
    if (!saunaId || !rating || !title || !content || !visitDate) {
      console.log('Missing required fields:', {
        saunaId: !!saunaId,
        rating: !!rating,
        title: !!title,
        content: !!content,
        visitDate: !!visitDate
      });
      return res.status(400).json({ 
        message: 'All required fields must be provided',
        missing: {
          saunaId: !saunaId,
          rating: !rating,
          title: !title,
          content: !content,
          visitDate: !visitDate
        }
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if sauna exists
    const sauna = await prisma.sauna.findUnique({
      where: { id: saunaId }
    });

    if (!sauna) {
      return res.status(404).json({ message: 'Sauna not found' });
    }

    // Check if user already reviewed this sauna
    const existingReview = await prisma.review.findFirst({
      where: {
        saunaId,
        userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this sauna' 
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        saunaId,
        userId,
        rating,
        title,
        content,
        visitDate: new Date(visitDate),
        visibility: visibility.toUpperCase()
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            trustScore: true
          }
        },
        sauna: {
          select: {
            name: true
          }
        }
      }
    });

    // Update sauna rating and review count
    const reviews = await prisma.review.findMany({
      where: { 
        saunaId,
        visibility: 'PUBLIC' 
      },
      select: { rating: true }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.sauna.update({
      where: { id: saunaId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    // Update user contribution count
    await prisma.user.update({
      where: { id: userId },
      data: {
        contributionCount: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { saunaId, userId, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    let whereClause: any = {
      visibility: 'PUBLIC'
    };

    if (saunaId) {
      whereClause.saunaId = saunaId as string;
    }

    if (userId) {
      whereClause.userId = userId as string;
      // If querying by userId, include all visibility levels for that user
      delete whereClause.visibility;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            trustScore: true
          }
        },
        sauna: {
          select: {
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limitNumber
    });

    const total = await prisma.review.count({ where: whereClause });

    res.json({
      reviews,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        sauna: {
          select: {
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limitNumber
    });

    const total = await prisma.review.count({ where: { userId } });

    res.json({
      reviews,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      rating,
      title,
      content,
      visitDate,
      visibility
    } = req.body;

    const userId = req.user!.id;

    // Find the review
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(title && { title }),
        ...(content && { content }),
        ...(visitDate && { visitDate: new Date(visitDate) }),
        ...(visibility && { visibility: visibility.toUpperCase() })
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            trustScore: true
          }
        },
        sauna: {
          select: {
            name: true
          }
        }
      }
    });

    // Recalculate sauna rating if rating was updated
    if (rating) {
      const reviews = await prisma.review.findMany({
        where: { 
          saunaId: existingReview.saunaId,
          visibility: 'PUBLIC' 
        },
        select: { rating: true }
      });

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await prisma.sauna.update({
        where: { id: existingReview.saunaId },
        data: { rating: avgRating }
      });
    }

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Find the review
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Delete review
    await prisma.review.delete({
      where: { id }
    });

    // Recalculate sauna rating and review count
    const reviews = await prisma.review.findMany({
      where: { 
        saunaId: existingReview.saunaId,
        visibility: 'PUBLIC' 
      },
      select: { rating: true }
    });

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    await prisma.sauna.update({
      where: { id: existingReview.saunaId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    res.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};