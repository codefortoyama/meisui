import {useMeisuiData} from '../hooks/useMeisuiData';
import {useVisits} from '../hooks/useVisits';
import {ProgressCard} from '../components/ProgressCard';
import {ErrorView} from '../components/ErrorView';
import {LoadingView} from '../components/LoadingView';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const {spots, loading, error} = useMeisuiData();
  const {visitedCount} = useVisits(spots?.length ?? 0);
  const totalCount = spots?.length ?? 0;
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <section className={styles.homeSection}>
      <header className={styles.header}>
        <h1>とやま名水めぐり</h1>
        <p>富山県内の名水スポットをめぐる観光アプリ</p>
      </header>

      <main className={styles.main}>
        <ProgressCard
          visitedCount={visitedCount}
          totalCount={totalCount}
        />

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalCount}</span>
            <span className={styles.statLabel}>スポット数</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{visitedCount}</span>
            <span className={styles.statLabel}>訪問数</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{percentage}%</span>
            <span className={styles.statLabel}>達成率</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => window.location.hash = '/map'}>
            地図から探す
          </button>
          <button className={styles.btn} onClick={() => window.location.hash = '/stamps'}>
            スタンプ帳を見る
          </button>
        </div>

        <p className={styles.dataSource}>データ出典: とやまの名水一覧（とやま県オープンデータポータル）</p>
      </main>
    </section>
  );
};