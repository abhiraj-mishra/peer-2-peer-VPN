import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

// ─── Purchase / Connect Modal ────────────────────────────────────────────────
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
          <span className="modal-title">Connect to Provider</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="modal-detail-row">
            <span className="label">IP Address</span>
            <span className="value mono">{provider.public_ip_masked}</span>
          </div>
          <div className="modal-detail-row">
            <span className="label">Port</span>
            <span className="value">{provider.listen_port || '51820'}</span>
          </div>
          <div className="modal-detail-row">
            <span className="label">Location</span>
            <span className="value">{provider.location || 'N/A'}</span>
          </div>
          <div className="modal-detail-row">
            <span className="label">Price per GB</span>
            <span className="value" style={{ color: 'var(--success)' }}>
              ${Number(provider.price_per_gb || 0).toFixed(2)} / GB
            </span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          This will create an active WireGuard tunnel to this provider. A config file will be generated for you.
        </p>

        <div className="modal-actions">
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePurchase} disabled={loading}>
            {loading ? 'Connecting…' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Success Modal (show config download) ────────────────────────────────────
const SuccessModal = ({ tunnelData, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">🎉 Connected!</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <div className="alert alert-success" style={{ marginBottom: 20 }}>
        Tunnel created successfully. Download your WireGuard config below.
      </div>

      <div className="modal-detail-row">
        <span className="label">Tunnel ID</span>
        <span className="value mono" style={{ fontSize: '0.75rem' }}>{tunnelData.tunnelId}</span>
      </div>
      <div className="modal-detail-row">
        <span className="label">Provider IP</span>
        <span className="value mono">{tunnelData.provider?.public_ip}</span>
      </div>
      <div className="modal-detail-row">
        <span className="label">Port</span>
        <span className="value">{tunnelData.provider?.listen_port}</span>
      </div>

      <div className="modal-actions" style={{ marginTop: 20 }}>
        <a
          href={`http://localhost:3000/tunnel/${tunnelData.tunnelId}/config`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
        >
          ⬇ Download .conf
        </a>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Done</button>
      </div>
    </div>
  </div>
);

// ─── Marketplace Tab ─────────────────────────────────────────────────────────
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
      } catch (err) {
        setError('Failed to load marketplace.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 120, borderRadius: 12, marginBottom: 12 }} className="skeleton" />
      ))}
    </div>
  );

  if (error) return <div className="alert alert-error">{error}</div>;

  if (providers.length === 0) return (
    <div className="empty-state">
      <p style={{ fontSize: '2rem', marginBottom: 8 }}>🌐</p>
      <p>No providers listed yet.</p>
      <p style={{ marginTop: 4, fontSize: '0.8rem' }}>Providers can list their nodes from their dashboard.</p>
    </div>
  );

  return (
    <>
      {activeTunnelId && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          You have an active tunnel. Purchasing will replace it.
        </div>
      )}

      <div className="provider-grid">
        {providers.map(p => (
          <div key={p._id} className="provider-card">
            <div className="provider-card-header">
              <div>
                <div className="provider-ip">{p.public_ip_masked}</div>
                {p.location && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>
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
                <p style={{ color: 'var(--success)' }}>${Number(p.price_per_gb || 0).toFixed(2)}</p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-sm"
              onClick={() => setSelectedProvider(p)}
            >
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
        <SuccessModal
          tunnelData={tunnelResult}
          onClose={() => setTunnelResult(null)}
        />
      )}
    </>
  );
};

// ─── Profile Tab ─────────────────────────────────────────────────────────────
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
        device_config: { public_key: config.public_key }
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
          {status === 'success' ? 'Profile updated.' : 'Failed to update profile.'}
        </div>
      )}
      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Username</label>
          <input value={config.username} onChange={e => setConfig({ ...config, username: e.target.value })}
            placeholder="alice" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Display Name</label>
          <input value={config.full_name} onChange={e => setConfig({ ...config, full_name: e.target.value })}
            placeholder="Alice" />
        </div>
      </div>
      <div className="form-group">
        <label>WireGuard Public Key</label>
        <input value={config.public_key} onChange={e => setConfig({ ...config, public_key: e.target.value })}
          placeholder="Base64-encoded key" className="mono" />
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
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <strong>Active tunnel:</strong> {String(tunnelId)}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`http://localhost:3000/tunnel/${tunnelId}/config`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ textDecoration: 'none' }}
            >
              ⬇ Download Config
            </a>
            <button className="btn btn-danger btn-sm" onClick={handleDisconnect} disabled={loading}>
              {loading ? 'Disconnecting…' : 'Disconnect'}
            </button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔌</p>
          <p>No active tunnel.</p>
          <p style={{ marginTop: 4, fontSize: '0.8rem' }}>Go to the Marketplace tab to connect to a provider.</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
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
      {[1,2].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 10, marginBottom: 16 }} className="skeleton" />
      ))}
    </div>
  );

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 4 }}>Client Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {clientInfo?.email} &nbsp;·&nbsp;
          <span style={{ color: 'var(--success)' }}>
            ${Number(clientInfo?.wallet_balance || 0).toFixed(2)} balance
          </span>
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'marketplace', label: '🌐 Marketplace' },
          { id: 'connection',  label: '🔌 Connection' },
          { id: 'profile',     label: '👤 Profile' },
        ].map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card">
        {tab === 'marketplace' && (
          <MarketplaceTab activeTunnelId={clientInfo?.active_tunnel_id} />
        )}
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
    </div>
  );
};

export default ClientDashboard;
