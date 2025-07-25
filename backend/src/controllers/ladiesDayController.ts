import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const createLadiesDay = async (req: AuthRequest, res: Response) => {
  try {
    const {
      saunaId,
      dayOfWeek,
      specificDate,
      startTime,
      endTime,
      isOfficial,
      sourceType
    } = req.body;

    const userId = req.user!.id;

    // Validation
    console.log('Ladies day creation data:', { saunaId, dayOfWeek, specificDate, startTime, endTime, isOfficial, sourceType, userId });
    
    if (!saunaId) {
      return res.status(400).json({ 
        message: 'Sauna ID is required' 
      });
    }

    if (!['USER', 'OFFICIAL'].includes(sourceType)) {
      return res.status(400).json({ 
        message: 'Valid source type is required' 
      });
    }

    if (dayOfWeek === undefined && !specificDate) {
      return res.status(400).json({ 
        message: 'Either dayOfWeek or specificDate must be provided' 
      });
    }

    // Check if sauna exists
    const sauna = await prisma.sauna.findUnique({
      where: { id: saunaId }
    });

    if (!sauna) {
      return res.status(404).json({ message: 'Sauna not found' });
    }

    // Check for existing similar entries
    const searchCriteria = {
      saunaId,
      dayOfWeek: dayOfWeek || null,
      specificDate: specificDate ? new Date(specificDate) : null,
      sourceUserId: userId
    };
    
    console.log('Checking for duplicate with criteria:', searchCriteria);
    
    const existingEntry = await prisma.ladiesDay.findFirst({
      where: searchCriteria
    });
    
    console.log('Existing entry found:', !!existingEntry, existingEntry?.id);

    if (existingEntry) {
      return res.status(400).json({ 
        message: 'You have already posted this ladies day information',
        duplicateId: existingEntry.id,
        details: 'この日付・曜日の情報は既に投稿済みです。異なる日付または時間帯で投稿してください。'
      });
    }

    const ladiesDay = await prisma.ladiesDay.create({
      data: {
        saunaId,
        dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : null,
        specificDate: specificDate ? new Date(specificDate) : null,
        startTime,
        endTime,
        isOfficial: isOfficial || false,
        sourceType: sourceType,
        sourceUserId: userId,
        trustScore: req.user!.trustScore
      },
      include: {
        sauna: {
          select: {
            name: true
          }
        },
        sourceUser: {
          select: {
            username: true,
            trustScore: true
          }
        }
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
      message: 'Ladies day information added successfully',
      ladiesDay
    });
  } catch (error) {
    console.error('Create ladies day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const voteLadiesDay = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'SUPPORT' or 'OPPOSE'
    const userId = req.user!.id;

    // Validation
    if (!['SUPPORT', 'OPPOSE'].includes(voteType)) {
      return res.status(400).json({ 
        message: 'Vote type must be SUPPORT or OPPOSE' 
      });
    }

    // Check if ladies day exists
    const ladiesDay = await prisma.ladiesDay.findUnique({
      where: { id }
    });

    if (!ladiesDay) {
      return res.status(404).json({ message: 'Ladies day entry not found' });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_ladiesDayId: {
          userId,
          ladiesDayId: id
        }
      }
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        return res.status(400).json({ 
          message: 'You have already cast this vote' 
        });
      }

      // Update existing vote
      await prisma.vote.update({
        where: {
          userId_ladiesDayId: {
            userId,
            ladiesDayId: id
          }
        },
        data: {
          voteType
        }
      });
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          userId,
          ladiesDayId: id,
          voteType
        }
      });
    }

    // Recalculate vote counts and trust score
    const votes = await prisma.vote.findMany({
      where: { ladiesDayId: id }
    });

    const supportCount = votes.filter(v => v.voteType === 'SUPPORT').length;
    const oppositionCount = votes.filter(v => v.voteType === 'OPPOSE').length;
    
    // Calculate new trust score based on votes and source user's trust score
    const totalVotes = supportCount + oppositionCount;
    let newTrustScore = ladiesDay.trustScore;
    
    if (totalVotes > 0) {
      const voteRatio = supportCount / totalVotes;
      newTrustScore = Math.min(5, Math.max(0, voteRatio * 5));
    }

    // Update ladies day entry
    await prisma.ladiesDay.update({
      where: { id },
      data: {
        supportCount,
        oppositionCount,
        trustScore: newTrustScore
      }
    });

    res.json({
      message: 'Vote recorded successfully',
      supportCount,
      oppositionCount,
      trustScore: newTrustScore
    });
  } catch (error) {
    console.error('Vote ladies day error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLadiesDays = async (req: Request, res: Response) => {
  try {
    const { saunaId, date, dayOfWeek } = req.query;

    let whereClause: any = {};

    if (saunaId) {
      whereClause.saunaId = saunaId as string;
    }

    if (date) {
      whereClause.specificDate = new Date(date as string);
    }

    if (dayOfWeek) {
      whereClause.dayOfWeek = parseInt(dayOfWeek as string);
    }

    const ladiesDays = await prisma.ladiesDay.findMany({
      where: whereClause,
      include: {
        sauna: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        sourceUser: {
          select: {
            username: true,
            trustScore: true
          }
        },
        votes: true
      },
      orderBy: [
        { trustScore: 'desc' },
        { supportCount: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      ladiesDays
    });
  } catch (error) {
    console.error('Get ladies days error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTodaysLadiesDays = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const ladiesDays = await prisma.ladiesDay.findMany({
      where: {
        OR: [
          { dayOfWeek }, // Regular weekly ladies days
          { specificDate: todayDate } // Special one-time events
        ]
      },
      include: {
        sauna: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            priceRange: true,
            rating: true
          }
        },
        sourceUser: {
          select: {
            username: true,
            trustScore: true
          }
        }
      },
      orderBy: [
        { trustScore: 'desc' },
        { supportCount: 'desc' }
      ]
    });

    res.json({
      date: todayDate,
      dayOfWeek,
      ladiesDays
    });
  } catch (error) {
    console.error('Get todays ladies days error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};