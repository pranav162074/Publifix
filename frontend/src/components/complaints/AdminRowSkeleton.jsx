import Skeleton from '../common/Skeleton';
import styles from './AdminRowSkeleton.module.css';

const AdminRowSkeleton = () => {
  return (
    <div className={styles.row}>
      <Skeleton width="100px" height="100px" borderRadius="6px" />

      <div className={styles.info}>
        <div className={styles.topRow}>
          <Skeleton width="50%" height="1rem" />
          <Skeleton width="70px" height="1.2rem" borderRadius="999px" />
        </div>
        <Skeleton width="30%" height="0.8rem" className={styles.spacer} />
        <Skeleton width="90%" height="0.85rem" className={styles.spacer} />
        <Skeleton width="40%" height="0.75rem" className={styles.spacer} />
      </div>

      <Skeleton width="120px" height="2rem" borderRadius="4px" />
    </div>
  );
};

export default AdminRowSkeleton;