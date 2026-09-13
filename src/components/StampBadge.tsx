import styles from './StampBadge.module.css';

interface StampBadgeProps {
  badges: string[];
}

export const StampBadge = ({badges}: StampBadgeProps) => {
  return (
    <div className={styles.stampBadge}>
      {badges.map((badge) => (
        <span key={badge} className={styles.badge}>
          {badge}
        </span>
      ))}
    </div>
  );
};