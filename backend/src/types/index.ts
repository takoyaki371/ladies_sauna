export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  trustScore: number;
  contributionCount: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sauna {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  priceRange: string;
  facilities: Facility[];
  ladiesDays: LadiesDay[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LadiesDay {
  id: string;
  saunaId: string;
  dayOfWeek?: number; // 0=Sunday, 1=Monday, etc. null for custom dates
  specificDate?: Date; // For one-time events
  startTime?: string;
  endTime?: string;
  isOfficial: boolean;
  sourceType: 'official' | 'user';
  sourceUserId?: string;
  trustScore: number;
  supportCount: number;
  oppositionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Facility {
  id: string;
  saunaId: string;
  name: string;
  category: 'sauna' | 'bath' | 'amenity' | 'other';
  temperature?: number;
  description?: string;
  isWomenOnly: boolean;
}

export interface Review {
  id: string;
  saunaId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  visitDate: Date;
  visibility: 'public' | 'friends' | 'private';
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  saunaId: string;
  userId: string;
  content: string;
  imageUrl?: string;
  visibility: 'public' | 'friends' | 'private';
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  saunaId: string;
  createdAt: Date;
}

export interface NotificationSettings {
  userId: string;
  ladiesDayReminder: boolean;
  reminderTiming: 'morning' | 'evening' | 'both';
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface Vote {
  id: string;
  userId: string;
  ladiesDayId: string;
  voteType: 'support' | 'oppose';
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}