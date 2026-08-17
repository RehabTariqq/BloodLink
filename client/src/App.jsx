import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Donations from './pages/Donations';
import Appointments from './pages/Appointments';
import Notifications from './pages/Notifications';
import DonorProfile from './pages/DonorProfile';
import RegisterHospital from './pages/RegisterHospital';
import PatientHistory from './pages/PatientHistory';
import AuditLogs from './pages/AuditLogs';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/app/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/app/dashboard" />} />

      <Route path="/app" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-profile" element={<DonorProfile />} />
        <Route path="donors" element={<Donors />} />
        <Route path="donations" element={<Donations />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="requests" element={<Requests />} />
        <Route path="patient-history" element={<PatientHistory />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="register-hospital" element={<RegisterHospital />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>
    </Routes>
  );
}

export default App;