import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 960, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60, padding: '0 20px',
      }}>
        {/* Brand */}
        <Link to="/" onClick={() => setMenuOpen(false)} style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px var(--accent-glow)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
              <path d="M12 6v3M12 15v3M6 12h3M15 12h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            P2P<span style={{ color: 'var(--accent)' }}>VPN</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-desktop">
          {user ? (
            <>
              <span style={{
                fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                padding: '4px 10px', borderRadius: 6, letterSpacing: '0.03em',
              }}>
                {user.role === 'provider' ? '⚡ Provider' : '🛡 Client'}
              </span>
              <Link to="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-hamburger"
          style={{
            display: 'none',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px', cursor: 'pointer',
            color: 'var(--text)',
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }} className="nav-mobile-menu">
          {user ? (
            <>
              <div style={{
                fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600,
                padding: '6px 0', borderBottom: '1px solid var(--border)',
                marginBottom: 4,
              }}>
                {user.role === 'provider' ? '⚡ Provider Account' : '🛡 Client Account'}
              </div>
              <Link to="/dashboard" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
