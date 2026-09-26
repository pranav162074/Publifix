import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getComplaintsForMap } from '../api/complaintApi';
import StatusBadge from '../components/complaints/StatusBadge';
import styles from './MapView.module.css';

// Fix Leaflet's default marker icon paths, which break under Vite's bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = [20.5937, 78.9629]; // Roughly the center of India
const DEFAULT_ZOOM = 5;

const MapView = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await getComplaintsForMap();
        setComplaints(res.data);
      } catch (err) {
        setError('Failed to load map data.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <p className={styles.status}>Loading map...</p>;
  if (error) return <p className={styles.status}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Complaint Map</h2>
      <p className={styles.subtitle}>
        {complaints.length} reported issue{complaints.length !== 1 ? 's' : ''} with location data
      </p>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {complaints.map((complaint) => (
          <Marker
            key={complaint._id}
            position={[complaint.location.lat, complaint.location.lng]}
          >
            <Popup>
              <div className={styles.popup}>
                <strong>{complaint.title}</strong>
                <p className={styles.popupCategory}>{complaint.category}</p>
                <StatusBadge status={complaint.status} />
                <br />
                <Link to={`/complaints/${complaint._id}`}>View details</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;