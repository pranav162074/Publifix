import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import styles from './ComplaintCard.module.css';

const ComplaintCard = ({ complaint }) => {
  return (
    <Link to={`/complaints/${complaint._id}`} className={styles.card}>
      {complaint.photoUrl && (
        <img
          src={complaint.photoUrl}
          alt={complaint.title}
          className={styles.image}
        />
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3>{complaint.title}</h3>
          <StatusBadge status={complaint.status} />
        </div>

        <p className={styles.category}>{complaint.category}</p>
        <p className={styles.description}>{complaint.description}</p>

        <p className={styles.date}>
          Reported on {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default ComplaintCard;