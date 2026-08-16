import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="public-nav">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <svg className="auth-logo-icon" viewBox="0 0 24 24" fill="currentColor" style={{ width: 22, height: 22 }}>
          <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z" />
        </svg>
        <span className="auth-logo-text display-font" style={{ fontSize: '1.1rem' }}>
          Blood<span>Link</span>
        </span>
      </Link>

      <div className="public-nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
      </div>

      <div className="nav-cta">
        <Link to="/login" className="btn-ghost">Sign In</Link>
        <Link to="/register" className="btn-solid">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;