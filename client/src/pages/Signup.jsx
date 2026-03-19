import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'client' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,109,255,0.12) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp 0.4s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px var(--accent-glow)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
              <path d="M12 6v3M12 15v3M6 12h3M15 12h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join the decentralized VPN network
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{
              marginBottom: 20, padding: '10px 14px',
              background: 'var(--danger-bg)', border: '1px solid rgba(244,63,94,0.25)',
              borderRadius: 10, fontSize: '0.85rem', color: 'var(--danger)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Choose a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.85rem', padding: 0,
                  }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label>I want to</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                {[
                  { value: 'client', emoji: '🛡', title: 'Use VPN', desc: 'Browse & connect to nodes' },
                  { value: 'provider', emoji: '⚡', title: 'Host Node', desc: 'List your WireGuard node' },
                ].map(({ value, emoji, title, desc }) => {
                  const selected = formData.role === value;
                  return (
                    <label
                      key={value}
                      htmlFor={`role-${value}`}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 4,
                        padding: '14px 10px', borderRadius: 12, cursor: 'pointer',
                        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        background: selected ? 'rgba(124,109,255,0.1)' : 'var(--surface-2)',
                        boxShadow: selected ? '0 0 14px rgba(124,109,255,0.15)' : 'none',
                        transition: 'all 0.18s ease',
                        textTransform: 'none',
                        letterSpacing: 'normal',
                        color: selected ? 'var(--text)' : 'var(--text-muted)',
                      }}
                    >
                      <input
                        id={`role-${value}`}
                        type="radio"
                        name="role"
                        value={value}
                        checked={formData.role === value}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{title}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>{desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ marginTop: 4, padding: '12px', fontSize: '0.95rem', borderRadius: 10 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Creating account…
                </span>
              ) : 'Create account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-2)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 400px) {
          .role-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Signup;
