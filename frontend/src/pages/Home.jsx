import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <h1>Welcome to Publifix</h1>
      <p>
        Report damaged or neglected public infrastructure in your area and
        track what happens next.
      </p>

      {user ? (
        <Link to="/new-complaint" className={styles.cta}>
          Report an Issue
        </Link>
      ) : (
        <Link to="/signup" className={styles.cta}>
          Get Started
        </Link>
      )}
    </div>
  );
};

export default Home;