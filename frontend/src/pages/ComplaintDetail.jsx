import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getComplaintById } from '../api/complaintApi';
import StatusBadge from '../components/complaints/StatusBadge';
import styles from './ComplaintDetail.module.css';

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await getComplaintById(id);
        setComplaint(res.data);
      } catch (err) {
        setError('Could not load this complaint.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) return <p className={styles.status}>Loading...</p>;
  if (error) return <p className={styles.status}>{error}</p>;
  if (!complaint) return null;

  return (
    <div className={styles.container}>
      {complaint.photoUrl && (
        <img
          src={complaint.photoUrl}
          alt={complaint.title}
          className={styles.image}
        />
      )}

      <div className={styles.header}>
        <h2>{complaint.title}</h2>
        <StatusBadge status={complaint.status} />
      </div>

      <p className={styles.category}>{complaint.category}</p>
      <p className={styles.description}>{complaint.description}</p>

      <p className={styles.meta}>
        Reported on {new Date(complaint.createdAt).toLocaleDateString()}
      </p>

      {complaint.address && (
        <p className={styles.meta}>Location: {complaint.address}</p>
      )}
    </div>
  );
};

export default ComplaintDetail;