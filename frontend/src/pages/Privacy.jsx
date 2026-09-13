import styles from './Privacy.module.css';

const Privacy = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: September 2026</p>

      <p>
        Publifix is a project for reporting and tracking damaged public
        infrastructure. This page explains what information we collect and
        how it's used.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Your name and email address, when you sign up (directly or via Google).</li>
        <li>Complaint details you submit, including photos, descriptions, and category.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To let you log in and see your own complaint history.</li>
        <li>To display and manage submitted complaints within the app.</li>
      </ul>

      <h2>Google Sign-In</h2>
      <p>
        If you sign in with Google, we only receive your name and email
        address from Google. We don't request access to your Gmail, Drive,
        or any other Google data.
      </p>

      <h2>Data sharing</h2>
      <p>
        We do not sell or share your personal information with third
        parties. Complaint photos are stored securely via Cloudinary, and
        account data is stored in MongoDB Atlas.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Reach out at{' '}
        <a href="mailto:saipranavreddygade5@gmail.com">
          saipranavreddygade5@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;