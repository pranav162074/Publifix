import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminPanel from './pages/AdminPanel';
import Privacy from './pages/Privacy';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-complaint"
          element={
            <ProtectedRoute>
              <NewComplaint />
            </ProtectedRoute>
          }
        />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;