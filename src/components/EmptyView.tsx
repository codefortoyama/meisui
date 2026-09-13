import styles from './EmptyView.module.css';

export const EmptyView = () => {
  return (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyMessage}>表示するデータがありません</p>
    </div>
  );
};