import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../api/complaintApi';
import styles from './NewComplaint.module.css';

const categories = ['pothole', 'streetlight', 'garbage', 'drainage', 'other'];

const NewComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationStatus('unsupported');
        resolve(null);
        return;
      }

      setLocationStatus('locating');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('success');
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocationStatus('denied');
          resolve(null);
        },
        { timeout: 8000 }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const location = await getLocation();

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (photo) data.append('photo', photo);
      if (location) {
        data.append('lat', location.lat);
        data.append('lng', location.lng);
      }

      const res = await createComplaint(data);
      navigate(`/complaints/${res.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit complaint. Try again.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Report an Issue</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          name="title"
          placeholder="Short title (e.g. Broken streetlight on 5th Ave)"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <select name="category" value={formData.category} onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Describe the issue in detail..."
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label className={styles.fileLabel}>
          {photo ? 'Change Photo' : 'Upload Photo'}
          <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
        </label>

        {preview && <img src={preview} alt="Preview" className={styles.preview} />}

        {locationStatus === 'locating' && (
          <p className={styles.locationNote}>Getting your location...</p>
        )}
        {locationStatus === 'success' && (
          <p className={styles.locationNote}>📍 Location attached</p>
        )}
        {locationStatus === 'denied' && (
          <p className={styles.locationNote}>
            Location permission denied — complaint will be submitted without a map pin.
          </p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default NewComplaint;