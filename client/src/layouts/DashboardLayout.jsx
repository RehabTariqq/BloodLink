import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg className="auth-logo-icon" viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
            <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z" />
          </svg>
          <span className="auth-logo-text" style={{ fontSize: '1.1rem' }}>
            Blood<span>Link</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/donors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Donors
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Inventory
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Blood Requests
          </NavLink>
        </nav>
      </aside>

      <div className="main-area">
        <div className="topbar">
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
            <div className="role-badge">{user?.role}</div>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;