import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <section className={styles.notFoundPage}>
      <h2>ページが見つかりません</h2>
      <p>お探しのページは存在しないか、移動された可能性があります。</p>
      <button className={styles.homeButton} onClick={() => window.location.hash = '/'}>
        ホームへ戻る
      </button>
    </section>
  );
};