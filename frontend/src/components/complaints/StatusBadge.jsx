import styles from './StatusBadge.module.css';

const statusColors = {
  pending: styles.pending,
  'in-review': styles.inReview,
  'in-progress': styles.inProgress,
  resolved: styles.resolved,
  rejected: styles.rejected,
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`${styles.badge} ${statusColors[status] || ''}`}>
      {status}
    </span>
  );
};

export default StatusBadge;