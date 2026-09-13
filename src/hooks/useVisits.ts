import {useEffect} from 'react';
import type {MeisuiSpot} from '../types/meisui';
import {
  getVisits,
  hasVisited,
  getVisitCount,
  getBadgeAchievements,
  saveVisit,
  getVisitedSpots,
} from '../utils/storage';

export {saveVisit} from '../utils/storage';
export {getVisits, hasVisited, getVisitCount, getBadgeAchievements, getVisitedSpots} from '../utils/storage';

export function useVisits(totalSpots: number) {
  useEffect(() => {
    // Ensure localStorage is initialized
  }, []);

  const visitedCount = getVisitCount();
  const visitedSpots = getVisitedSpots();
  const {badges, visitedCount: badgeVisitedCount} = getBadgeAchievements(totalSpots);

  const getRank = (count: number) => {
    if (count >= 66) return { title: '富山名水コンプリート神', color: '#7c3aed' };
    if (count >= 51) return { title: '名水レジェンド', color: '#dc2626' };
    if (count >= 31) return { title: '名水マスター', color: '#ea580c' };
    if (count >= 16) return { title: '名水探検家', color: '#ca8a04' };
    if (count >= 6) return { title: '名水愛好家', color: '#16a34a' };
    if (count >= 1) return { title: '名水ビギナー', color: '#2563eb' };
    return { title: '名水ルーキー', color: '#64748b' };
  };

  const currentRank = getRank(visitedCount);

  return {
    visitedCount,
    visitedSpots,
    badgeAchievements: {badges, visitedCount: badgeVisitedCount},
    currentRank,
    hasVisited: (spotId: string) => hasVisited(spotId),
    saveVisit,
    hasVisitedSpot: (spotId: string) => hasVisited(spotId),
    getUnvisitedSpots: (spots: MeisuiSpot[]) => {
      const visitedIds = getVisitedSpots();
      return spots.filter((spot) => !visitedIds.includes(spot.id));
    },
  };
}