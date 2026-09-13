import styles from './AppHeader.module.css';

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span>とやま名水めぐり</span>
      </div>
      <p className={styles.subtitle}>`とやまの名水一覧`より公開している観光情報です</p>
    </header>
  );
};