import styles from './SpotCard.module.css';
import type {MeisuiSpot} from '../types/meisui';

interface SpotCardProps {
  spot: MeisuiSpot;
  isVisited: boolean;
  onToggleVisit?: (spotId: string) => void;
}

export const SpotCard = ({spot, isVisited, onToggleVisit}: SpotCardProps) => {
  return (
    <div className={styles.spotCard} tabIndex={0}>
      <h3 className={styles.spotName}>{spot.name}</h3>
      <p className={styles.spotMunicipality}>{spot.municipality}</p>
      <p className={styles.spotAddress}>{spot.address}</p>
      <p className={styles.spotNotes}>{spot.notes || ''}</p>
      <div className={styles.visitStatus}>
        {isVisited ? (
          <span className={styles.visitedMark}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9 16l6 6L15 7l-5-5L9 16z"/>
            </svg>
            訪問済み
          </span>
        ) : (
          <button
            className={styles.visitButton}
            onClick={() => onToggleVisit?.(spot.id)}
          >
            スタンプをもらう
          </button>
        )}
      </div>
    </div>
  );
};