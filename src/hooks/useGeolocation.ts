import {useEffect, useState, useCallback} from 'react';

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