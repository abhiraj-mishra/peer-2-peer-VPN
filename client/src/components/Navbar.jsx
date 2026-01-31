import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            P2P VPN
          </Link>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
