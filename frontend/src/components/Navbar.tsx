import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        🌳 LeafLedger
      </Link>

      <div className="navbar-links">
        <Link to="/map" className={isActive('/map')}>🗺 Map</Link>
        {user && <Link to="/dashboard" className={`${isActive('/dashboard')} hide-mobile`}>📊 Dashboard</Link>}

        {user ? (
          <div className="flex items-center gap-2">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--color-green-primary)' }}
              />
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }} className="hide-mobile">
              {user.displayName}
            </span>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
