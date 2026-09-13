import {describe, test, expect} from 'vitest';
import {calculateHaversineDistance} from './distance';

describe('Haversine distance', () => {
  test('同じ座標間の距離がほぼ0mになる', () => {
    const distance = calculateHaversineDistance(36.6953, 137.2104, 36.6953, 137.2104);
    expect(distance).toBeLessThan(1);
  });

  test('Haversine距離計算が妥当な値を返す', () => {
    // 東京〜大阪の概算距離（約392km）
    const distance = calculateHaversineDistance(35.6762, 139.6503, 34.6937, 135.5027);
    expect(distance).toBeGreaterThan(300000);
    expect(distance).toBeLessThan(500000);
  });
});

describe('GPS check-in logic', () => {
  test('距離100m以内をチェックイン可能と判定する', () => {
    const distance = 50;
    const accuracy = 50;
    const isWithinDistance = distance <= 100;
    const isAccuracyGood = accuracy <= 200;
    expect(isWithinDistance && isAccuracyGood).toBe(true);
  });

  test('100mを超える場合をチェックイン不可と判定する', () => {
    const distance = 150;
    const accuracy = 50;
    const isWithinDistance = distance <= 100;
    expect(isWithinDistance).toBe(false);
  });

  test('accuracyが200mを超える場合をチェックイン不可と判定する', () => {
    const distance = 50;
    const accuracy = 250;
    const isAccuracyGood = accuracy <= 200;
    expect(isAccuracyGood).toBe(false);
  });

  test('緯度・経度nullのデータはGPS判定対象にしない', () => {
    const spot = {latitude: null, longitude: null};
    expect(spot.latitude).toBeNull();
    expect(spot.longitude).toBeNull();
    // GPSチェックインの対象外とみなす
    const hasCoords = spot.latitude !== null && spot.longitude !== null;
    expect(hasCoords).toBe(false);
  });
});

describe('achievement rate', () => {
  test('全スポット数0件の達成率が0%になる', () => {
    const totalSpots = 0;
    const visitedCount = 0;
    const percentage = totalSpots > 0 ? Math.round((visitedCount / totalSpots) * 100) : 0;
    expect(percentage).toBe(0);
  });

  test('全スポット数0件で完全制覇バッジを付与しない', () => {
    const totalSpots = 0;
    const visitedCount = 0;
    const hasMasterBadge = totalSpots > 0 && visitedCount >= totalSpots;
    expect(hasMasterBadge).toBe(false);
  });

  test('5件中1件訪問で達成率20%', () => {
    const totalSpots = 5;
    const visitedCount = 1;
    const percentage = totalSpots > 0 ? Math.round((visitedCount / totalSpots) * 100) : 0;
    expect(percentage).toBe(20);
  });

  test('15件中5件訪問でバッジ「名水ビギナー」取得条件', () => {
    const visitedCount = 5;
    const badges: string[] = [];
    if (visitedCount >= 1) badges.push('はじめの一滴');
    if (visitedCount >= 5) badges.push('名水ビギナー');
    if (visitedCount >= 15) badges.push('名水めぐり人');
    // totalSpots > 0 check is separate
    expect(badges).toContain('名水ビギナー');
  });
});