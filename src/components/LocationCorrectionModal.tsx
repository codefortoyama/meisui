import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import styles from './LocationCorrectionModal.module.css';

interface Props {
  spotId: string;
  spotName: string;
  initialLat: number;
  initialLon: number;
  onClose: () => void;
}

export const LocationCorrectionModal = ({ spotId, spotName, initialLat, initialLon, onClose }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState({ lat: initialLat, lon: initialLon });
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Initialize map
    const map = L.map('correction-map', {
      center: [initialLat, initialLon],
      zoom: 17,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Draggable marker
    const marker = L.marker([initialLat, initialLon], {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on('dragend', (e) => {
      const latLng = e.target.getLatLng();
      setCoords({ lat: latLng.lat, lon: latLng.lng });
    });

    // Map click to move marker
    map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [initialLat, initialLon]);

  const handleManualCoordChange = (key: 'lat' | 'lon', value: string) => {
    const num = parseFloat(value);
    const newCoords = { ...coords, [key]: num || 0 };
    setCoords(newCoords);
    
    if (!isNaN(num) && mapRef.current && markerRef.current) {
        const latLng: L.LatLngExpression = [newCoords.lat, newCoords.lon];
        markerRef.current.setLatLng(latLng);
        mapRef.current.panTo(latLng);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const [lon, lat] = data[0].geometry.coordinates;
        setCoords({ lat, lon });
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          mapRef.current.setView([lat, lon], 17);
        }
      } else {
        alert('場所が見つかりませんでした。別の言葉で試してください。');
      }
    } catch (e) {
      alert('検索中にエラーが発生しました。');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitMail = () => {
    const subject = encodeURIComponent(`【位置修正申請】${spotName}`);
    const body = encodeURIComponent(
      `名水スポット位置修正のリクエスト\n\n` +
      `スポットID: ${spotId}\n` +
      `スポット名: ${spotName}\n\n` +
      `■ 修正後の位置\n` +
      `緯度: ${coords.lat}\n` +
      `経度: ${coords.lon}\n` +
      `地図URL: https://www.google.com/maps?q=${coords.lat},${coords.lon}\n\n` +
      `■ コメント\n` +
      `${comment}\n\n` +
      `--- アプリからの送信 ---`
    );
    
    window.location.href = `mailto:codefortoyama@gmail.com?subject=${subject}&body=${body}`;
    alert('メールアプリを起動します。送信を完了させてください。');
  };

  const handleSubmitGitHub = () => {
    const jsonFragment = JSON.stringify({
      id: spotId,
      name: spotName,
      latitude: parseFloat(coords.lat.toFixed(6)),
      longitude: parseFloat(coords.lon.toFixed(6))
    }, null, 2);

    const title = encodeURIComponent(`[Location Correction] ${spotName}`);
    const body = encodeURIComponent(
      `## スポット位置修正の提案\n\n` +
      `| 項目 | 内容 |\n` +
      `| --- | --- |\n` +
      `| スポット名 | ${spotName} |\n` +
      `| ID | ${spotId} |\n` +
      `| 新しい緯度 | ${coords.lat.toFixed(6)} |\n` +
      `| 新しい経度 | ${coords.lon.toFixed(6)} |\n\n` +
      `### コメント\n${comment || 'なし'}\n\n` +
      `### 修正用データ (Maintainer use only)\n` +
      `\`\`\`json\n${jsonFragment}\n\`\`\`\n\n` +
      `--- \nSubmitted via Toyama Meisui App`
    );
    
    const repoUrl = "https://github.com/codefortoyama/meisui"; 
    window.open(`${repoUrl}/issues/new?title=${title}&body=${body}`, '_blank');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>位置を修正する</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </header>

        <div className={styles.instruction}>
            ピンをドラッグするか、地図をタップしてください。場所の名前で検索も可能です。
        </div>

        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="アバウトな場所（例：立山駅、富山市中央通り）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? '検索中...' : '検索して移動'}
          </button>
        </div>

        <div id="correction-map" className={styles.mapContainer}></div>

        <div className={styles.form}>
          <div className={styles.coordDisplay}>
            <div className={styles.coordItem}>
              <label>緯度</label>
              <input 
                type="number" 
                step="0.000001"
                value={coords.lat} 
                onChange={(e) => handleManualCoordChange('lat', e.target.value)}
              />
            </div>
            <div className={styles.coordItem}>
              <label>経度</label>
              <input 
                type="number" 
                step="0.000001"
                value={coords.lon} 
                onChange={(e) => handleManualCoordChange('lon', e.target.value)}
              />
            </div>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="補足情報があれば入力してください（例：駐車場の入り口付近です、等）"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className={styles.buttonGroup}>
            <button className={styles.githubButton} onClick={handleSubmitGitHub}>
              GitHubで報告 (推奨)
            </button>
            <button className={styles.mailButton} onClick={handleSubmitMail}>
              メールで報告
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
