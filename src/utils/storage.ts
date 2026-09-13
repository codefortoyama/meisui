import type { MeisuiSpot, VisitRecord } from '../types/meisui';

const PREFIX = 'toyama-meisui:';

export function getVisits(): VisitRecord[] {
  try {
    const raw = localStorage.getItem(`${PREFIX}visits`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (record: any): record is VisitRecord =>
        record && typeof record.spotId === 'string' && typeof record.visitedAt === 'string'
    );
  } catch {
    return [];
  }
}

export function saveVisit(record: VisitRecord): boolean {
  try {
    const visits = getVisits();
    if (visits.some((v) => v.spotId === record.spotId)) return false;
    const newVisit = {...record, visitedAt: new Date().toISOString()};
    localStorage.setItem(`${PREFIX}visits`, JSON.stringify([...visits, newVisit]));
    return true;
  } catch {
    return false;
  }
}

export function hasVisited(spotId: string): boolean {
  return getVisits().some((v) => v.spotId === spotId);
}

export function getVisitCount(): number {
  return getVisits().length;
}

export function getVisitedSpots(): string[] {
  return getVisits().map((v) => v.spotId);
}

export function getUnvisitedSpots(spots: MeisuiSpot[]): MeisuiSpot[] {
  const visitedIds = getVisitedSpots();
  return spots.filter((spot) => !visitedIds.includes(spot.id));
}

export function getBadgeAchievements(totalSpots: number): {badges: string[], visitedCount: number} {
  const visitedCount = getVisitCount();
  const badges: string[] = [];

  if (visitedCount >= 1) {
    badges.push('はじめの一滴');
  }
  if (visitedCount >= 5) {
    badges.push('名水ビギナー');
  }
  if (visitedCount >= 15) {
    badges.push('名水めぐり人');
  }
  if (totalSpots > 0 && visitedCount >= totalSpots) {
    badges.push('富山名水マスター');
  }

  return {badges, visitedCount};
}