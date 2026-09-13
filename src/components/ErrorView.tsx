import styles from './ErrorView.module.css';

export const ErrorView = ({error, onRetry}: {error: string, onRetry: () => void}) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>エラー: {error}</p>
      <button className={styles.retryButton} onClick={onRetry}>再読み込み</button>
    </div>
  );
};