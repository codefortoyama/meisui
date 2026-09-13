import React, {useState, useMemo} from 'react';
import {useMeisuiData} from '../hooks/useMeisuiData';
import {useVisits, saveVisit} from '../hooks/useVisits';
import {ProgressCard} from '../components/ProgressCard';
import {ErrorView} from '../components/ErrorView';
import {LoadingView} from '../components/LoadingView';
import styles from './SpotListPage.module.css';

export const SpotListPage = () => {
  const {spots, loading, error} = useMeisuiData();
  const {visitedCount, hasVisited} = useVisits(
    spots?.length ?? 0,
  );
  const totalCount = spots?.length ?? 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');

  const municipalities = useMemo(() => {
    if (!spots) return [];
    const set = new Set(spots.map(s => s.municipality).filter(m => m));
    return Array.from(set).sort();
  }, [spots]);

  const filteredSpots = useMemo(() => {
    return (spots || []).filter((spot) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMunicipality =
        !municipalityFilter || spot.municipality === municipalityFilter;
      return matchesSearch && matchesMunicipality;
    });
  }, [spots, searchQuery, municipalityFilter]);

  const sortedSpots = useMemo(() => {
    return [...filteredSpots].sort((a, b) => {
      const aVisited = hasVisited(a.id);
      const bVisited = hasVisited(b.id);
      if (aVisited && !bVisited) return 1; // Visited items at bottom
      if (!aVisited && bVisited) return -1;
      return 0;
    });
  }, [filteredSpots, hasVisited]);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  const onSpotClick = (spotId: string) => {
    window.location.hash = `/spots/${spotId}`;
  };

  return (
    <section className={styles.listPage}>
      <header className={styles.pageHeader}>
        <h1>スポット一覧</h1>
        <ProgressCard
          visitedCount={visitedCount}
          totalCount={totalCount}
        />
      </header>

      <main className={styles.listMain}>
        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <label htmlFor="search" className={styles.filterLabel}>検索:</label>
            <input
              id="search"
              className={styles.searchInput}
              type="text"
              placeholder="スポット名や住所を検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterItem}>
            <label htmlFor="municipality" className={styles.filterLabel}>市町村:</label>
            <select
              id="municipality"
              className={styles.municipalitySelect}
              value={municipalityFilter}
              onChange={(e) => setMunicipalityFilter(e.target.value)}
            >
              <option value="">すべての市町村</option>
              {municipalities.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.resultsCount}>
            {filteredSpots.length} 件見つかりました
        </div>

        {sortedSpots.length === 0 ? (
          <p className={styles.noResults}>条件に合うスポットが見つかりません</p>
        ) : (
          <ul className={styles.spotList}>
            {sortedSpots.map((spot) => (
              <li 
                key={spot.id} 
                className={`${styles.spotListItem} ${hasVisited(spot.id) ? styles.visited : ''}`}
                onClick={() => onSpotClick(spot.id)}
              >
                <div className={styles.spotInfo}>
                  <h3 className={styles.spotListName}>{spot.name}</h3>
                  <div className={styles.spotMeta}>
                    <span className={styles.spotTag}>{spot.municipality}</span>
                    <span className={styles.spotAddress}>{spot.address}</span>
                  </div>
                  {spot.latitude && spot.longitude && (
                    <div 
                      className={styles.mapLink}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.hash = `/map`;
                        // Potential issue: how to center map on this spot?
                        // For now, it just goes to map page.
                      }}
                    >
                      📍 地図で見る
                    </div>
                  )}
                </div>
                <div className={styles.visitStatus}>
                  {hasVisited(spot.id) ? (
                    <span className={styles.visitedBadge}>訪問済み</span>
                  ) : (
                    <span className={styles.unvisitedBadge}>未訪問</span>
                  )}
                  <div className={styles.chevron}>&rsaquo;</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </section>
  );
};
