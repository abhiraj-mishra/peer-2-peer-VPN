import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

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

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);

  const [config, setConfig] = useState({
    public_ip: '',
    listen_port: '51820',
    public_key: '',
    price_per_gb: '',
    location: '',
  });

  const [providerInfo, setProviderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/provider/details');
        setProviderInfo(res.data);

        let ip = res.data.public_ip || '';
        if (!ip) {
          try {
            const ipRes = await axios.get('https://api.ipify.org?format=json');
            ip = ipRes.data.ip;
          } catch {}
        }

        setConfig({
          public_ip: ip,
          listen_port: res.data.listen_port || '51820',
          public_key: res.data.public_key || '',
          price_per_gb: res.data.price_per_gb || '',
          location: res.data.location || '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setStatus('');
    try {
      await api.post('/api/provider/update', config);
      setStatus('success');
      setProviderInfo({ ...providerInfo, ...config });
    } catch {
      setStatus('error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleListing = async () => {
    setListingLoading(true);
    try {
      const res = await api.post('/api/provider/listing/toggle');
      setProviderInfo({ ...providerInfo, is_listed: res.data.is_listed });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || 'Failed to toggle listing.';
      setStatus(msg);
    } finally {
      setListingLoading(false);
    }
  };

  if (loading) return (
    <div className="page-wrap">
      {[1, 2].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 12, marginBottom: 16 }} className="skeleton" />
      ))}
    </div>
  );

  const isListed = providerInfo?.is_listed;

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{
        marginBottom: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
            ⚡ Provider Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {providerInfo?.email} · Manage your WireGuard node
          </p>
        </div>
        <span className={`badge ${isListed ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.8rem', padding: '5px 14px' }}>
          {isListed ? <><span className="dot" /> Live on Marketplace</> : '⬤ Not Listed'}
        </span>
      </div>

      {/* Listing Toggle */}
      <div className="toggle-row" style={{ marginBottom: 24 }}>
        <div className="toggle-info">
          <h3>Marketplace Listing</h3>
          <p>{isListed ? 'Your node is visible to clients.' : 'Enable to appear in the marketplace.'}</p>
        </div>
        <button
          className={`btn ${isListed ? 'btn-danger' : 'btn-success'}`}
          style={{ minWidth: 120 }}
          onClick={handleToggleListing}
          disabled={listingLoading}
        >
          {listingLoading
            ? <><Spinner /> Loading…</>
            : isListed ? '🔴 Unlist Node' : '🟢 List Node'}
        </button>
      </div>

      {/* Status Messages */}
      {status === 'success' && <div className="alert alert-success">✓ Configuration saved successfully.</div>}
      {status === 'error' && <div className="alert alert-error">✕ Failed to save configuration.</div>}
      {typeof status === 'string' && status.length > 10 && status !== 'success' && status !== 'error' && (
        <div className="alert alert-error">{status}</div>
      )}

      {/* Current Config Summary */}
      {providerInfo && (providerInfo.public_ip || providerInfo.public_key) && (
        <div className="card" style={{ marginBottom: 20 }}>
          <p className="section-title">Current Node Config</p>
          <div className="info-grid">
            {[
              { label: 'Public IP', value: providerInfo.public_ip || '—', mono: true },
              { label: 'Port', value: providerInfo.listen_port || '—', mono: true },
              { label: 'Price / GB', value: providerInfo.price_per_gb ? `$${providerInfo.price_per_gb}` : '—', color: 'var(--success)' },
              { label: 'Location', value: providerInfo.location || '—' },
            ].map((item, i) => (
              <div key={i} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value mono" style={item.color ? { color: item.color, fontWeight: 700 } : {}}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Form */}
      <div className="card">
        <p className="section-title">Update Configuration</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Public IP <span style={{ color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0 }}>(auto-detected)</span></label>
            <input type="text" value={config.public_ip} readOnly />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Listen Port</label>
              <input
                type="text"
                name="listen_port"
                value={config.listen_port}
                onChange={e => setConfig({ ...config, listen_port: e.target.value })}
                placeholder="51820"
              />
            </div>
            <div className="form-group">
              <label>Price per GB ($)</label>
              <input
                type="number"
                step="0.01"
                name="price_per_gb"
                value={config.price_per_gb}
                onChange={e => setConfig({ ...config, price_per_gb: e.target.value })}
                placeholder="0.10"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location <span style={{ color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text"
              name="location"
              value={config.location}
              onChange={e => setConfig({ ...config, location: e.target.value })}
              placeholder="e.g. US East, Frankfurt, Singapore"
            />
          </div>

          <div className="form-group">
            <label>WireGuard Public Key</label>
            <input
              type="text"
              name="public_key"
              value={config.public_key}
              onChange={e => setConfig({ ...config, public_key: e.target.value })}
              placeholder="Base64-encoded public key"
              className="mono"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={saveLoading}>
            {saveLoading ? <><Spinner /> Saving…</> : 'Save configuration'}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ProviderDashboard;
