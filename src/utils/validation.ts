import type { MeisuiSpot } from '../types/meisui';

export function validateSpot(spot: any): spot is MeisuiSpot {
  return (
    typeof spot.id === 'string' &&
    typeof spot.name === 'string' &&
    typeof spot.municipality === 'string' &&
    typeof spot.address === 'string' &&
    typeof spot.description === 'string' &&
    (typeof spot.latitude === 'number' || spot.latitude === null) &&
    (typeof spot.longitude === 'number' || spot.longitude === null) &&
    (spot.imageUrl === null || typeof spot.imageUrl === 'string') &&
    (spot.sourceUrl === null || typeof spot.sourceUrl === 'string') &&
    (spot.notes === null || typeof spot.notes === 'string') &&
    (spot.visitedAt === null || typeof spot.visitedAt === 'string')
  );
}

export function normalizeSpots(raw: any[]): MeisuiSpot[] {
  const result: MeisuiSpot[] = [];
  for (const item of raw) {
    if (!item) continue;

    const spot: MeisuiSpot = {
      id: typeof item.id === 'string' ? item.id : '',
      name: typeof item.name === 'string' ? item.name : '',
      municipality: typeof item.municipality === 'string' ? item.municipality : '',
      address: typeof item.address === 'string' ? item.address : '',
      description: typeof item.description === 'string' ? item.description : '',
      latitude: item.latitude !== null && !isNaN(item.latitude) && item.latitude >= -90 && item.latitude <= 90 ? item.latitude : null,
      longitude: item.longitude !== null && !isNaN(item.longitude) && item.longitude >= -180 && item.longitude <= 180 ? item.longitude : null,
      imageUrl: item.imageUrl !== null && typeof item.imageUrl === 'string' ? item.imageUrl : null,
      sourceUrl: item.sourceUrl !== null && typeof item.sourceUrl === 'string' ? item.sourceUrl : null,
      notes: item.notes !== null && typeof item.notes === 'string' ? item.notes : null,
      visitedAt: item.visitedAt !== null && typeof item.visitedAt === 'string' ? item.visitedAt : null,
    };

    if (validateSpot(spot)) {
      result.push(spot);
    }
  }
  return result;
}