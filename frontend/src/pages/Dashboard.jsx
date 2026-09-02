import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyComplaints } from '../api/complaintApi';
import { useAuth } from '../hooks/useAuth';
import ComplaintCard from '../components/complaints/ComplaintCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await getMyComplaints();
        setComplaints(res.data);
      } catch (err) {
        setError('Failed to load your complaints. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Welcome, {user?.name}</h2>
        <Link to="/new-complaint" className={styles.newBtn}>
          + Report an Issue
        </Link>
      </div>

      {loading && <p>Loading your complaints...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && complaints.length === 0 && (
        <p>You haven't reported any issues yet.</p>
      )}

      <div className={styles.grid}>
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint._id} complaint={complaint} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;