import {useEffect, useState, useCallback} from 'react';
import type {MeisuiSpot} from '../types/meisui';
import {normalizeSpots, validateSpot} from '../utils/validation';
import {getVisits, hasVisited, getVisitCount} from '../utils/storage';
import {calculateHaversineDistance} from '../utils/distance';

const API_BASE = import.meta.env.BASE_URL;

export function useMeisuiData() {
  const [spots, setSpots] = useState<MeisuiSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE}data/meisui.json`);
        if (response.ok) {
          const raw = await response.json();
          const validSpots = normalizeSpots(raw.filter((item: any) => item !== null && typeof item === 'object'));
          setSpots(validSpots);
        } else {
          throw new Error(`データの読み込みに失敗しました: ${response.status}`);
        }
        setLoading(false);
      } catch (err) {
        console.error('データ読み込みエラー:', err);
        setError((err as Error).message);
        setLoading(false);
        if (!cancelled) {
          setError('データの読み込みに失敗しました。再読み込みしてください。');
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  return {spots, loading, error};
}

export function useGeolocation() {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState('geolocation' in navigator);

  const getCurrentPosition = useCallback(
    (options: {
      enableHighAccuracy: boolean;
      timeout: number;
      maximumAge: number;
    } = {enableHighAccuracy: true, timeout: 10000, maximumAge: 30000}) => {
      if (!isSupported) {
        setErrorMessage('ブラウザが位置情報取得に対応していません');
        return;
      }

      const success = (pos: GeolocationPosition) => {
        const crd = pos.coords;
        setPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          accuracy: crd.accuracy,
        });
        setErrorMessage(null);
      };

      const failure = (err: GeolocationPositionError) => {
        let message = '';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = '位置情報が許可されていません';
            break;
          case err.POSITION_UNAVAILABLE:
            message = '位置情報を取得できません';
            break;
          case err.TIMEOUT:
            message = '位置情報取得がタイムアウトしました';
            break;
          default:
            message = '位置情報取得エラー';
        }
        setErrorMessage(message);
      };

      navigator.geolocation.getCurrentPosition(success, failure, options);
    },
    [isSupported]
  );

  return {
    position,
    errorMessage,
    isSupported,
    getCurrentPosition,
    clearError: () => setErrorMessage(null),
  };
}