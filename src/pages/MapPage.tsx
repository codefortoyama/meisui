import React, {useRef, useEffect, useState, useMemo} from 'react';
import {useMeisuiData} from '../hooks/useMeisuiData';
import {useGeolocation} from '../hooks/useGeolocation';
import {useVisits} from '../hooks/useVisits';
import {SpotMarker} from '../components/SpotMarker';
import {calculateHaversineDistance} from '../utils/distance';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {MunicipalityFilter} from '../components/MunicipalityFilter';
import {SearchBox} from '../components/SearchBox';
import {ProgressCard} from '../components/ProgressCard';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import styles from './MapPage.module.css';

L.Map.mergeOptions({
  preferCanvas: true,
});

// Fix for default Leaflet icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MAP_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

const DEFAULT_CENTER: [number, number] = [36.696, 137.213]; // 富山市中心部

export const MapPage = () => {
  const {spots, loading, error} = useMeisuiData();
  const {position, errorMessage: geoError, isSupported, getCurrentPosition} = useGeolocation();
  const {visitedCount, visitedSpots, hasVisited, badgeAchievements} = useVisits(
    spots?.length ?? 0,
  );
  const totalCount = spots?.length ?? 0;
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');

  const municipalities = useMemo(() => {
    if (!spots) return [];
    const set = new Set(spots.map(s => s.municipality).filter(m => m));
    return Array.from(set).sort();
  }, [spots]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const handleGetCurrentPosition = () => {
    getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  };

  const onSpotClick = (spotId: string) => {
    window.location.hash = `/spots/${spotId}`;
  };

  const filteredSpots = useMemo(() => {
    return (spots || []).filter((spot) => {
      if (spot.latitude === null || spot.longitude === null) return false;
      
      const matchesSearch =
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMunicipality =
        !municipalityFilter || spot.municipality === municipalityFilter;
      
      return matchesSearch && matchesMunicipality;
    });
  }, [spots, searchQuery, municipalityFilter]);

  useEffect(() => {
    if (loading || error) return;

    // Map already initialized?
    if (mapRef.current) {
      // Just update markers and view
      if (!markersLayerRef.current) {
        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      
      markersLayerRef.current.clearLayers();
      filteredSpots.forEach((spot) => {
        const marker = SpotMarker({
          position: [spot.latitude!, spot.longitude!],
          onClick: () => onSpotClick(spot.id),
          visited: hasVisited(spot.id),
          name: spot.name,
        });
        marker.addTo(markersLayerRef.current!);
      });

      if (position) {
        mapRef.current.panTo([position.latitude, position.longitude], {animate: false});
      }
      return;
    }

    // Initialize map
    const initialCenter = position 
      ? [position.latitude, position.longitude] as [number, number]
      : DEFAULT_CENTER;

    const map = L.map('map', {
      center: initialCenter,
      zoom: position ? 13 : 10,
      zoomAnimation: false, // Prevent _leaflet_pos error during rapid remounts
    });

    L.tileLayer(MAP_TILE_URL, {
      attribution: MAP_ATTRIBUTION,
      maxZoom: 18,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    filteredSpots.forEach((spot) => {
      const marker = SpotMarker({
        position: [spot.latitude!, spot.longitude!],
        onClick: () => onSpotClick(spot.id),
        visited: hasVisited(spot.id),
        name: spot.name,
      });
      marker.addTo(markersLayer);
    });

    if (!position && filteredSpots.length > 0) {
      const bounds = L.latLngBounds(filteredSpots.map(s => [s.latitude!, s.longitude!] as [number, number]));
      map.fitBounds(bounds, {padding: [20, 20], animate: false});
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [loading, error, filteredSpots, hasVisited, position]);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <section className={styles.mapPage}>
      <div id="map" className={styles.mapContainer} style={{height: '500px', width: '100%', background: '#eee'}}></div>

      <div className={styles.mapControls}>
        <button
          className={styles.controlButton}
          onClick={handleGetCurrentPosition}
          aria-label="現在地表示"
        >
          現在地表示
        </button>

        <MunicipalityFilter
          municipalities={municipalities}
          selectedMunicipality={municipalityFilter}
          onSelectChange={setMunicipalityFilter}
        />

        <SearchBox
          onSearchChange={setSearchQuery}
          placeholder="スポット名や住所を検索"
        />
      </div>

      <ProgressCard
        visitedCount={visitedCount}
        totalCount={totalCount}
      />

      {position && (
        <div className={styles.currentLocation}>
          <p>現在地: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}</p>
        </div>
      )}

      {/* $FlowFixMe */}
      {geoError && <p className={styles.geoError}>{geoError}</p>}
    </section>
  );
};
