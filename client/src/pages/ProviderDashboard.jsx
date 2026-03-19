import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
    setStatus('');
    try {
      await api.post('/api/provider/update', config);
      setStatus('success');
      setProviderInfo({ ...providerInfo, ...config });
    } catch {
      setStatus('error');
    }
  };

  const handleToggleListing = async () => {
    setListingLoading(true);
    try {
      const res = await api.post('/api/provider/listing/toggle');
      setProviderInfo({ ...providerInfo, is_listed: res.data.is_listed });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || 'Failed to toggle listing.';
      setStatus('listing_error');
      // store temporarily in status for display
      setStatus(msg);
    } finally {
      setListingLoading(false);
    }
  };

  if (loading) return (
    <div className="page-wrap">
      {[1, 2].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 10, marginBottom: 16 }} className="skeleton" />
      ))}
    </div>
  );

  const isListed = providerInfo?.is_listed;

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 4 }}>Provider Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {providerInfo?.email} &nbsp;·&nbsp; Configure and list your WireGuard node.
        </p>
      </div>

      {/* Listing Toggle */}
      <div className="toggle-row" style={{ marginBottom: 20 }}>
        <div className="toggle-info">
          <h3>Marketplace Listing</h3>
          <p>
            {isListed
              ? 'Your node is visible to clients.'
              : 'Enable to appear in the marketplace.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className={`badge ${isListed ? 'badge-green' : 'badge-gray'}`}
          >
            {isListed ? <><span className="dot" />Listed</> : 'Unlisted'}
          </span>
          <button
            className={`btn btn-sm ${isListed ? 'btn-danger' : 'btn-success'}`}
            onClick={handleToggleListing}
            disabled={listingLoading}
          >
            {listingLoading ? '…' : isListed ? 'Unlist' : 'List Node'}
          </button>
        </div>
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="alert alert-success">Configuration saved.</div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">Failed to save configuration.</div>
      )}
      {typeof status === 'string' && status.length > 10 && (
        <div className="alert alert-error">{status}</div>
      )}

      {/* Current Config Summary */}
      {providerInfo && (providerInfo.public_ip || providerInfo.public_key) && (
        <div className="card" style={{ marginBottom: 20 }}>
          <p className="section-title">Current Node</p>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Public IP</div>
              <div className="info-value mono">{providerInfo.public_ip || '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Port</div>
              <div className="info-value mono">{providerInfo.listen_port || '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Price / GB</div>
              <div className="info-value" style={{ color: 'var(--success)' }}>
                {providerInfo.price_per_gb ? `$${providerInfo.price_per_gb}` : '—'}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Location</div>
              <div className="info-value">{providerInfo.location || '—'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Update Form */}
      <div className="card">
        <p className="section-title">Update Configuration</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Public IP (auto-detected)</label>
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
            <label>Location (optional)</label>
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

          <button type="submit" className="btn btn-primary btn-sm">
            Save configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderDashboard;
