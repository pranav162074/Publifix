import { useEffect, useState } from 'react';
import { getAllComplaints, updateComplaintStatus } from '../api/complaintApi';
import StatusBadge from '../components/complaints/StatusBadge';
import AdminRowSkeleton from '../components/complaints/AdminRowSkeleton';
import Pagination from '../components/common/Pagination';
import styles from './AdminPanel.module.css';

const statusOptions = ['pending', 'in-review', 'in-progress', 'resolved', 'rejected'];

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComplaints, setTotalComplaints] = useState(0);

  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints(currentPage);
      setComplaints(res.data.complaints);
      setTotalPages(res.data.totalPages);
      setTotalComplaints(res.data.totalComplaints);
    } catch (err) {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateComplaintStatus(id, newStatus);
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Admin Panel</h2>
      <p className={styles.subtitle}>
        {loading ? 'Loading complaints...' : `${totalComplaints} total complaints`}
      </p>

      <div className={styles.list}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <AdminRowSkeleton key={i} />)
          : complaints.map((complaint) => (
              <div key={complaint._id} className={styles.row}>
                {complaint.photoUrl && (
                  <img
                    src={complaint.photoUrl}
                    alt={complaint.title}
                    className={styles.thumb}
                  />
                )}

                <div className={styles.info}>
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

                <div className={styles.actions}>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    disabled={updatingId === complaint._id}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
      </div>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminPanel;