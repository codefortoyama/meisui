import styles from './LoadingView.module.css';

export const LoadingView = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>データを読み込んでいます...</p>
    </div>
  );
};