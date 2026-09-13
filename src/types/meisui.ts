export type MeisuiSpot = {
  id: string;
  name: string;
  municipality: string;
  address: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  notes: string | null;
  visitedAt: string | null;
};

export type VisitRecord = {
  spotId: string;
  visitedAt: string;
};

export type Badge = {
  name: string;
  description: string;
};

export type AchievementState = {
  visitedCount: number;
  totalCount: number;
  percentage: number;
  badges: string[];
};