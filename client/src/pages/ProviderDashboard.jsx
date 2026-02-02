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
  });

  const [providerInfo, setProviderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [status, setStatus] = useState('');


  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        console.log('Fetching provider details...');
        const response = await api.get('/api/provider/details');
        console.log('Provider details response:', response.data);
        setProviderInfo(response.data);
        setFetchError(null);

        let fetchedIp = response.data.public_ip || '';

        if (!fetchedIp) {
          try {
            const ipRes = await axios.get('https://api.ipify.org?format=json');
            fetchedIp = ipRes.data.ip;
          } catch (err) {
            console.error('Failed to auto-fetch IP:', err);
          }
        }

        setConfig({
          public_ip: fetchedIp,
          listen_port: response.data.listen_port || '51820',
          public_key: response.data.public_key || '',
          price_per_gb: response.data.price_per_gb || '',
        });
      } catch (err) {
        console.error('Failed to fetch provider details:', err);
        setFetchError(err.response?.data || err.message || 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProviderDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/provider/update', config);
      setStatus('success');

      setProviderInfo({ ...providerInfo, ...config });
    } catch (err) {
      setStatus('error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Provider Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Configure your WireGuard node to accept client connections.
        </p>
      </div>

      {providerInfo && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Current Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{providerInfo.email || 'Not set'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Public IP</p>
              <p className="mt-1 text-sm font-mono text-slate-900">{providerInfo.public_ip || 'Not configured'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Listen Port</p>
              <p className="mt-1 text-sm font-mono text-slate-900">{providerInfo.listen_port || 'Not configured'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Public Key</p>
              <p className="mt-1 text-sm font-mono text-slate-900 truncate" title={providerInfo.public_key}>
                {providerInfo.public_key || 'Not configured'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Price per GB</p>
              <p className="mt-1 text-sm font-mono text-slate-900">
                {providerInfo.price_per_gb ? `$${providerInfo.price_per_gb}` : 'Not configured'}
              </p>
            </div>
          </div>
          {providerInfo.created_at && (
            <p className="mt-4 text-xs text-slate-500">
              Member since: {new Date(providerInfo.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">
          Update Configuration
        </h2>
        <p className="mb-6 text-sm text-slate-600">
          These values are used by clients to establish secure tunnels.
        </p>

        {status && (
          <div
            className={`mb-6 rounded-md border px-3 py-2 text-sm
              ${status === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
          >
            {status === 'success'
              ? 'Configuration saved successfully.'
              : 'Failed to save configuration.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Public IP address (Auto-detected)
            </label>
            <input
              type="text"
              name="public_ip"
              value={config.public_ip}
              readOnly
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Price per GB ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="price_per_gb"
              value={config.price_per_gb}
              onChange={handleChange}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Listen port
            </label>
            <input
              type="text"
              name="listen_port"
              value={config.listen_port}
              onChange={handleChange}
              placeholder="51820"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              WireGuard public key
            </label>
            <input
              type="text"
              name="public_key"
              value={config.public_key}
              onChange={handleChange}
              placeholder="Base64-encoded public key"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          >
            Save configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderDashboard;
