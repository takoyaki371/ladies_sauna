import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        trustScore: true,
        contributionCount: true,
        createdAt: true,
      }
    });

    // Create notification settings
    await prisma.notificationSettings.create({
      data: {
        userId: user.id,
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        trustScore: true,
        contributionCount: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            posts: true,
            favorites: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        ...user,
        reviewCount: user._count.reviews,
        postCount: user._count.posts,
        favoriteCount: user._count.favorites,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};