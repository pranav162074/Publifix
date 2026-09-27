import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Publifix
      </Link>

      <div className={styles.links}>
        <Link to="/map">Map</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/new-complaint">Report an Issue</Link>
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <Link to="/profile" className={styles.profileLink}>
              <img src={user.avatar} alt={user.name} className={styles.navAvatar} />
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;