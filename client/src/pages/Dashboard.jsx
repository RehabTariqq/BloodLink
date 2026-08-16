import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/dataService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    reportService.getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.response?.data?.message || ''));
  }, []);

  return (
    <div>
      <h1 className="page-title">Welcome back, <span style={{ color: 'var(--blue)' }}>{user?.name}</span></h1>

      {error && <p style={{ color: 'var(--text-muted)' }}>{error}</p>}

      {stats && (
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalDonors}</div><div className="stat-label">Total Donors</div></div>
          <div className="stat-card"><div className="stat-value">{stats.availableUnits}</div><div className="stat-label">Available Units</div></div>
          <div className="stat-card"><div className="stat-value">{stats.expiringSoon}</div><div className="stat-label">Expiring Soon</div></div>
          <div className="stat-card"><div className="stat-value">{stats.pendingRequests}</div><div className="stat-label">Pending Requests</div></div>
          <div className="stat-card"><div className="stat-value">{stats.emergencyRequests}</div><div className="stat-label">Emergency Requests</div></div>
          <div className="stat-card"><div className="stat-value">{stats.donationsThisMonth}</div><div className="stat-label">Donations This Month</div></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;