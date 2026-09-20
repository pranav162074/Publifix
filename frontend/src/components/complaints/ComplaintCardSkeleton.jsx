import Skeleton from '../common/Skeleton';
import styles from './ComplaintCardSkeleton.module.css';

const ComplaintCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <Skeleton height="150px" borderRadius="0" />

      <div className={styles.content}>
        <div className={styles.topRow}>
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="60px" height="1.2rem" borderRadius="999px" />
        </div>

        <Skeleton width="40%" height="0.8rem" className={styles.spacer} />
        <Skeleton width="100%" height="0.85rem" className={styles.spacer} />
        <Skeleton width="90%" height="0.85rem" className={styles.spacer} />
        <Skeleton width="50%" height="0.75rem" className={styles.spacer} />
      </div>
    </div>
  );
};

export default ComplaintCardSkeleton;