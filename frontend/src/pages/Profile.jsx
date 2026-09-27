import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyComplaintStats } from '../api/complaintApi';
import { deleteAccount } from '../api/authApi';
import StatusBadge from '../components/complaints/StatusBadge';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getMyComplaintStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load your complaint stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={user?.avatar} alt={user?.name} className={styles.avatar} />
        <h2>{user?.name}</h2>
        <p className={styles.email}>{user?.email}</p>
        {user?.role === 'admin' && <span className={styles.adminBadge}>Admin</span>}
      </div>

      <div className={styles.statsCard}>
        <h3>Your Complaints</h3>

        {loading && <p className={styles.status}>Loading stats...</p>}
        {error && <p className={styles.status}>{error}</p>}

        {stats && (
          <>
            <p className={styles.total}>{stats.total} total complaints filed</p>
            <div className={styles.statusGrid}>
              {Object.entries(stats.counts).map(([status, count]) => (
                <div key={status} className={styles.statusItem}>
                  <StatusBadge status={status} />
                  <span className={styles.count}>{count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>

        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className={styles.deleteBtn}
          >
            Delete Account
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <p>
              This will permanently delete your account and all your complaints.
              This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setConfirmingDelete(false)}
                className={styles.cancelBtn}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className={styles.confirmDeleteBtn}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, delete permanently'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;