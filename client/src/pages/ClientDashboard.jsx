import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

// ─── Purchase Modal ───────────────────────────────────────────────────────────
const PurchaseModal = ({ provider, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/client/purchase', { provider_id: provider._id });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Purchase failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">🔌 Connect to Provider</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 20, background: 'var(--surface-2)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {[
            { label: 'IP Address', value: provider.public_ip_masked, mono: true },
            { label: 'Port', value: provider.listen_port || '51820' },
            { label: 'Location', value: provider.location || 'N/A' },
            { label: 'Price per GB', value: `$${Number(provider.price_per_gb || 0).toFixed(2)} / GB`, color: 'var(--success)' },
          ].map((row, i) => (
            <div key={i} className="modal-detail-row" style={{ padding: '12px 16px' }}>
              <span className="label">{row.label}</span>
              <span className="value" style={row.mono ? { fontFamily: 'monospace', fontSize: '0.82rem' } : { color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          This will create an active WireGuard tunnel. A config file will be generated for download.
        </p>

        <div className="modal-actions">
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePurchase} disabled={loading}>
            {loading ? <><Spinner /> Connecting…</> : 'Connect →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = ({ tunnelData, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">🎉 Connected!</span>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>

      <div className="alert alert-success" style={{ marginBottom: 20 }}>
        Tunnel created. Download your WireGuard config below.
      </div>

      <div style={{ background: 'var(--surface-2)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
        {[
          { label: 'Tunnel ID', value: tunnelData.tunnelId, mono: true, small: true },
          { label: 'Provider IP', value: tunnelData.provider?.public_ip, mono: true },
          { label: 'Port', value: tunnelData.provider?.listen_port },
        ].map((row, i) => (
          <div key={i} className="modal-detail-row" style={{ padding: '12px 16px' }}>
            <span className="label">{row.label}</span>
            <span className="value" style={{ fontFamily: row.mono ? 'monospace' : 'inherit', fontSize: row.small ? '0.72rem' : '0.875rem' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className="modal-actions">
        <a
          href={`http://localhost:3000/tunnel/${tunnelData.tunnelId}/config`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ flex: 1, textDecoration: 'none' }}
        >
          ⬇ Download .conf
        </a>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Done</button>
      </div>
    </div>
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <span style={{
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  }} />
);

// ─── Marketplace Tab ──────────────────────────────────────────────────────────
const MarketplaceTab = ({ activeTunnelId }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [tunnelResult, setTunnelResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/client/marketplace');
        setProviders(res.data);
      } catch {
        setError('Failed to load marketplace.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 120, borderRadius: 12 }} className="skeleton" />)}
    </div>
  );

  if (error) return <div className="alert alert-error">{error}</div>;

  if (providers.length === 0) return (
    <div className="empty-state">
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌐</div>
      <p style={{ fontWeight: 600, marginBottom: 6 }}>No providers listed yet</p>
      <p style={{ fontSize: '0.8rem' }}>Providers can list their nodes from their dashboard.</p>
    </div>
  );

  return (
    <>
      {activeTunnelId && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          ⚠ You have an active tunnel. Purchasing a new one will replace it.
        </div>
      )}
      <div className="provider-grid">
        {providers.map(p => (
          <div key={p._id} className="provider-card">
            <div className="provider-card-header">
              <div>
                <div className="provider-ip">{p.public_ip_masked}</div>
                {p.location && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    📍 {p.location}
                  </div>
                )}
              </div>
              <span className="badge badge-green"><span className="dot" />Live</span>
            </div>
            <div className="provider-meta">
              <div className="meta-item">
                <label>Port</label>
                <p className="mono">{p.listen_port || '51820'}</p>
              </div>
              <div className="meta-item">
                <label>Price / GB</label>
                <p style={{ color: 'var(--success)', fontWeight: 700 }}>
                  ${Number(p.price_per_gb || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <button className="btn btn-primary btn-full btn-sm" onClick={() => setSelectedProvider(p)}>
              Connect →
            </button>
          </div>
        ))}
      </div>

      {selectedProvider && !tunnelResult && (
        <PurchaseModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onSuccess={(data) => { setTunnelResult(data); setSelectedProvider(null); }}
        />
      )}
      {tunnelResult && (
        <SuccessModal tunnelData={tunnelResult} onClose={() => setTunnelResult(null)} />
      )}
    </>
  );
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────
const ProfileTab = ({ clientInfo, onUpdated }) => {
  const [config, setConfig] = useState({
    full_name: clientInfo.full_name || '',
    username: clientInfo.username || '',
    public_key: clientInfo.device_config?.public_key || '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/client/update', {
        full_name: config.full_name,
        username: config.username,
        device_config: { public_key: config.public_key },
      });
      setStatus('success');
      onUpdated({ ...clientInfo, ...config });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {status && (
        <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
          {status === 'success' ? '✓ Profile updated successfully.' : '✕ Failed to update profile.'}
        </div>
      )}
      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Username</label>
          <input value={config.username} onChange={e => setConfig({ ...config, username: e.target.value })} placeholder="alice" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Display Name</label>
          <input value={config.full_name} onChange={e => setConfig({ ...config, full_name: e.target.value })} placeholder="Alice" />
        </div>
      </div>
      <div className="form-group">
        <label>WireGuard Public Key</label>
        <input value={config.public_key} onChange={e => setConfig({ ...config, public_key: e.target.value })} placeholder="Base64-encoded key" className="mono" />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
    </form>
  );
};

// ─── Connection Tab ───────────────────────────────────────────────────────────
const ConnectionTab = ({ clientInfo, onDisconnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDisconnect = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/api/client/disconnect');
      onDisconnect();
    } catch (err) {
      setError(err.response?.data?.error || 'Disconnect failed.');
    } finally {
      setLoading(false);
    }
  };

  const tunnelId = clientInfo.active_tunnel_id;

  return (
    <div>
      {tunnelId ? (
        <div>
          <div style={{
            background: 'var(--success-bg)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 12, padding: '16px 18px',
            marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: '1.3rem' }}>🟢</span>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--success)', fontSize: '0.875rem', marginBottom: 4 }}>Active Tunnel</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(tunnelId)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={`http://localhost:3000/tunnel/${tunnelId}/config`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: 'none' }}
            >
              ⬇ Download Config
            </a>
            <button className="btn btn-danger btn-sm" onClick={handleDisconnect} disabled={loading}>
              {loading ? <><Spinner /> Disconnecting…</> : '🔌 Disconnect'}
            </button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 14 }}>{error}</div>}
        </div>
      ) : (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔌</div>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>No active tunnel</p>
          <p style={{ fontSize: '0.8rem' }}>Go to the Marketplace tab to connect to a provider.</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const ClientDashboard = () => {
  const [tab, setTab] = useState('marketplace');
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/client/details');
        setClientInfo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="page-wrap">
      {[1, 2].map(i => <div key={i} style={{ height: 80, borderRadius: 12, marginBottom: 16 }} className="skeleton" />)}
    </div>
  );

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{
        marginBottom: 28,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
            🛡 Client Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{clientInfo?.email}</p>
        </div>
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10, padding: '8px 16px',
          fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)',
        }}>
          💰 ${Number(clientInfo?.wallet_balance || 0).toFixed(2)} balance
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'marketplace', label: '🌐 Marketplace' },
          { id: 'connection', label: '🔌 Connection' },
          { id: 'profile', label: '👤 Profile' },
        ].map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card">
        {tab === 'marketplace' && <MarketplaceTab activeTunnelId={clientInfo?.active_tunnel_id} />}
        {tab === 'connection' && (
          <ConnectionTab
            clientInfo={clientInfo}
            onDisconnect={() => setClientInfo({ ...clientInfo, active_tunnel_id: null })}
          />
        )}
        {tab === 'profile' && clientInfo && (
          <ProfileTab clientInfo={clientInfo} onUpdated={setClientInfo} />
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
