import React, {useEffect, useState} from 'react';
import {useMeisuiData} from '../hooks/useMeisuiData';
import {useVisits, saveVisit} from '../hooks/useVisits';
import {useGeolocation} from '../hooks/useGeolocation';
import {calculateHaversineDistance} from '../utils/distance';
import {useParams} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import {SpotMarker} from '../components/SpotMarker';
import {LocationCorrectionModal} from '../components/LocationCorrectionModal';
import styles from './SpotDetailPage.module.css';

export const SpotDetailPage = () => {
  const {spotId} = useParams<{spotId: string}>();
  const {spots, loading, error} = useMeisuiData();
  const {position, getCurrentPosition} = useGeolocation();
  const {visitedSpots, hasVisited} = useVisits(spots?.length ?? 0);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const spot = spots.find((s) => s.id === spotId);

  useEffect(() => {
    if (!spot || spot.latitude === null || spot.longitude === null) return;
    
    const map = L.map('detailMap', {
      center: [spot.latitude, spot.longitude],
      zoom: 15,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    const isVisited = hasVisited(spot.id);
    const marker = SpotMarker({
      position: [spot.latitude, spot.longitude],
      visited: isVisited,
      name: spot.name,
    });
    marker.addTo(map);

    return () => {
      map.remove();
    };
  }, [spot, hasVisited]);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  if (!spot) {
    return (
      <div className={styles.notFound}>
        <h2>スポットが見つかりません</h2>
        <button onClick={() => window.location.hash = '/'}>ホームへ戻る</button>
      </div>
    );
  }

  const isVisited = hasVisited(spot.id);
  const hasCoords = spot.latitude !== null && spot.longitude !== null;
  let distanceText = '';

  if (hasCoords && position) {
    const distance = calculateHaversineDistance(
      position.latitude,
      position.longitude,
      spot.latitude!,
      spot.longitude!,
    );
    distanceText = `${Math.round(distance)}m`;
  }

  return (
    <section className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <h1>{spot.name}</h1>
        <p>{spot.municipality}</p>
      </header>

      <main className={styles.detailMain}>
        <div className={styles.detailContent}>
          <p className={styles.description}>{spot.description}</p>

          {spot.notes && (
            <div className={styles.notesBox}>
              <p>注意事項: {spot.notes}</p>
            </div>
          )}

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>住所</span>
              <p className={styles.infoValue}>{spot.address}</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>訪問状態</span>
              <p className={styles.infoValue}>
                {isVisited ? '訪問済み' : '未訪問'}
              </p>
            </div>
            {hasCoords && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>緯度・経度</span>
                <p>
                  {spot.latitude?.toFixed(4)}, {spot.longitude?.toFixed(4)}
                </p>
              </div>
            )}
            {hasCoords && position && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>現在地からの距離</span>
                <p>{distanceText}</p>
              </div>
            )}
          </div>

          {hasCoords && (
            <div className={styles.mapSection}>
              <div id="detailMap" style={{height: '200px', width: '100%'}}></div>
              <div className={styles.mapFooter}>
                <p className={styles.mapAttribution}>
                    OpenStreetMap タイルによって提供されています
                </p>
                <button 
                  className={styles.correctionButton}
                  onClick={() => setShowCorrectionModal(true)}
                >
                  📍 位置を修正する
                </button>
              </div>
            </div>
          )}

          {showCorrectionModal && hasCoords && (
            <LocationCorrectionModal
              spotId={spot.id}
              spotName={spot.name}
              initialLat={spot.latitude!}
              initialLon={spot.longitude!}
              onClose={() => setShowCorrectionModal(false)}
            />
          )}

          {hasCoords && (
            <div className={styles.sourceLink}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Googleマップで経路を見る"
              >
                🗺️ Googleマップでナビ開始
              </a>
            </div>
          )}

          {spot.sourceUrl && (
            <div className={styles.sourceLink}>
              <a
                href={spot.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="外部サイトで詳細を見る"
              >
                🔗 外部サイトで詳細を見る
              </a>
            </div>
          )}

          <img
            src={spot.imageUrl}
            alt="Spot image"
            className={styles.spotImage}
          />

          {!spot.imageUrl && !spot.sourceUrl && (
            <div className={styles.placeholderBox}>
              <div className={styles.placeholderIcon}>💧</div>
              <p>画像は利用できません</p>
            </div>
          )}

          {hasCoords && (
            <button
              className={styles.stampButton}
              onClick={() => {
                if (!position) {
                  alert('位置情報を取得中です。しばらく待ってからもう一度お試しください。');
                  getCurrentPosition();
                  return;
                }

                const spotPos = {
                  latitude: spot.latitude!,
                  longitude: spot.longitude!,
                };
                const distance = calculateHaversineDistance(
                  position.latitude,
                  position.longitude,
                  spotPos.latitude,
                  spotPos.longitude,
                );

                if (distance <= 300 && position.accuracy <= 500) {
                  const record = {spotId: spot.id, visitedAt: new Date().toISOString()};
                  saveVisit(record);
                  alert('✨ スタンプを獲得しました！ ✨');
                } else if (distance > 300) {
                  alert(
                    `現在地とスポットの距離は約${Math.round(distance)}mです。もう少し近づいてから（目安: 300m以内）、もう一度お試しください。`,
                  );
                } else {
                  alert(
                    'GPS精度が不足しています（現在: 約' + Math.round(position.accuracy) + 'm）。正確な位置情報取得のため、空の開けた場所でお試しください。',
                  );
                }
              }}
            >
              スタンプを取得する
            </button>
          )}

          {!hasCoords && (
            <p className={styles.noGpsInfo}>
              緯度・経度がないため、GPSチェックインできません
            </p>
          )}

          <div className={styles.dataSource}>
            データ出典: とやまの名水一覧
          </div>
        </div>
      </main>
    </section>
  );
};
