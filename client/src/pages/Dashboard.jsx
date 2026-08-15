import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div className="auth-logo" style={{ marginBottom: 0 }}>
          <svg className="auth-logo-icon" viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
            <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z" />
          </svg>
          <span className="auth-logo-text" style={{ fontSize: '1.15rem' }}>
            Blood<span>Link</span>
          </span>
        </div>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <h1 className="dashboard-welcome">
          Welcome back, <span>{user?.name}</span>
        </h1>
        <p className="dashboard-meta">{user?.email}</p>
        <div className="role-badge">{user?.role}</div>
      </div>
    </div>
  );
};

export default Dashboard;