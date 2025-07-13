export interface Sauna {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  facilities: Facility[];
  ladiesDays: LadiesDay[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LadiesDay {
  id: string;
  saunaId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  startTime?: string;
  endTime?: string;
  isOfficial: boolean;
  sourceType: 'official' | 'user';
  sourceUserId?: string;
  trustScore: number;
  supportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  category: 'sauna' | 'bath' | 'amenity' | 'other';
  temperature?: number;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  trustScore: number;
  contributionCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  saunaId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  isPublic: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteList {
  id: string;
  userId: string;
  saunas: Sauna[];
}

export interface NotificationSettings {
  userId: string;
  ladiesDayReminder: boolean;
  reminderTiming: 'morning' | 'evening' | 'both';
  pushNotifications: boolean;
  emailNotifications: boolean;
}