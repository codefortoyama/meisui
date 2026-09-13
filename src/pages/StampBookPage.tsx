import {useMeisuiData} from '../hooks/useMeisuiData';
import {useVisits} from '../hooks/useVisits';
import {ProgressCard} from '../components/ProgressCard';
import {StampBadge} from '../components/StampBadge';
import {EmptyView} from '../components/EmptyView';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import styles from './StampBookPage.module.css';

export const StampBookPage = () => {
  const {spots, loading, error} = useMeisuiData();
  const {visitedCount, visitedSpots, badgeAchievements, currentRank} = useVisits(
    spots?.length ?? 0,
  );
  const totalCount = spots?.length ?? 0;

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  const {badges} = badgeAchievements;

  return (
    <section className={styles.stampBookPage}>
      <header className={styles.pageHeader}>
        <h1>スタンプ帳</h1>
        <div className={styles.rankContainer}>
          <span className={styles.rankLabel}>現在の称号:</span>
          <span className={styles.rankTitle} style={{color: currentRank.color}}>
            {currentRank.title}
          </span>
        </div>
        <ProgressCard
          visitedCount={visitedCount}
          totalCount={totalCount}
        />
      </header>

      <main className={styles.stampBookMain}>
        <div className={styles.achievement}>
          <div className={styles.rate}>
            <span>{visitedCount} / {totalCount} か所</span>
            <span>{Math.round((visitedCount / totalCount) * 100)}%</span>
          </div>
          <StampBadge badges={badges} />
        </div>

        {totalCount === 0 ? (
          <EmptyView />
        ) : (
          <ul className={styles.spotList}>
            {spots?.map((spot) => (
              <li key={spot.id} className={styles.listItem}>
                <div className={styles.listContent}>
                  <span className={styles.spotName}>{spot.name}</span>
                  <span className={styles.spotMunicipality}>{spot.municipality}</span>
                </div>
                <div className={styles.visitStatus}>
                  {visitedSpots.includes(spot.id) ? (
                    <span className={styles.visitedMark}>✓ 訪問済み</span>
                  ) : (
                    <span className={styles.unvisited}>未訪問</span>
                  )}
                </div>
                {spot.latitude !== null && spot.longitude !== null && (
                  <span className={styles.distance}>
                    {visitedSpots.includes(spot.id)
                      ? ''
                      : '（距離計算可能）'}
                  </span>
                )}
                {visitedSpots.includes(spot.id) && spot.visitedAt && (
                  <span className={styles.visitedAt}>
                    獲得日時: {new Date(spot.visitedAt).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className={styles.footer}>
        <button
          className={styles.initButton}
          onClick={() => {
            if (window.confirm('保存データを初期化しますか？\n全てのスタンプ記録が削除されます。')) {
              localStorage.removeItem('toyama-meisui:visits');
              window.location.reload();
            }
          }}
        >
          保存データを初期化
        </button>
      </footer>
    </section>
  );
};