import React from 'react';
import styles from './ProgressCard.module.css';

interface ProgressCardProps {
  visitedCount: number;
  totalCount: number;
  onBadgeClick?: (badge: string) => void;
}

export const ProgressCard = ({visitedCount, totalCount, onBadgeClick}: ProgressCardProps) => {
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  return (
    <div className={styles.progressCard}>
      <div className={styles.progressInfo}>
        <span className={styles.visitedCount}>{visitedCount}か所</span>
        <span className={styles.totalCount}>{totalCount}か所</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{width: `${percentage}%`}}
        />
      </div>
      <div className={styles.badgeList}>
        {['はじめの一滴', '名水ビギナー', '名水めぐり人', '富山名水マスター'].map((badge) => (
          <span
            key={badge}
            className={styles.badgeItem}
            onClick={() => onBadgeClick?.(badge)}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};