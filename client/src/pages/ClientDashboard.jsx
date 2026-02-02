import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);

  const [config, setConfig] = useState({
    full_name: '',
    username: '',
    public_key: '',
  });

  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await api.get('/api/client/details');
        setClientInfo(response.data);
        setConfig({
          full_name: response.data.full_name || '',
          username: response.data.username || '',
          public_key: response.data.device_config?.public_key || '',
        });
      } catch (err) {
        console.error('Failed to fetch client details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: config.full_name,
        username: config.username,
        device_config: {
          public_key: config.public_key
        }
      };
      await api.post('/api/client/update', payload);
      setStatus('success');
      // Update displayed info
      setClientInfo({
        ...clientInfo,
        full_name: config.full_name,
        username: config.username,
        device_config: { ...clientInfo.device_config, public_key: config.public_key }
      });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Client Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile and access available VPN tunnels.
        </p>
      </div>

      {/* Current Details Card */}
      {clientInfo && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Username</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{clientInfo.username || 'Not set'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{clientInfo.email || 'Not set'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Wallet Balance</p>
              <p className="mt-1 text-sm font-mono text-slate-900 font-bold text-emerald-600">
                {clientInfo.wallet_balance !== undefined ? `$${clientInfo.wallet_balance.toFixed(2)}` : '$0.00'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Public Key</p>
              <p className="mt-1 text-sm font-mono text-slate-900 truncate" title={clientInfo.device_config?.public_key}>
                {clientInfo.device_config?.public_key || 'Not configured'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Display Name</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{clientInfo.full_name || 'Not set'}</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Tunnel</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {clientInfo.active_tunnel_id ? (
                  <span className="text-emerald-600">Connected ({clientInfo.active_tunnel_id})</span>
                ) : (
                  <span className="text-slate-400">No active tunnel</span>
                )}
              </p>
            </div>
          </div>
          {clientInfo.created_at && (
            <p className="mt-4 text-xs text-slate-500">
              Member since: {new Date(clientInfo.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Update Profile
        </h2>

        {status && (
          <div
            className={`mb-6 rounded-md border px-3 py-2 text-sm
              ${status === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
          >
            {status === 'success'
              ? 'Profile updated successfully.'
              : 'Failed to update profile.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={config.username}
              onChange={handleChange}
              placeholder="client_alice"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Display name
            </label>
            <input
              type="text"
              name="full_name"
              value={config.full_name}
              onChange={handleChange}
              placeholder="Alice"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              WireGuard Public Key
            </label>
            <input
              type="text"
              name="public_key"
              value={config.public_key}
              onChange={handleChange}
              placeholder="Base64 encoded public key"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          >
            Save changes
          </button>
        </form>
      </div>

      {/* Tunnels Section */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Available Tunnels
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Browse and connect to available VPN providers.
        </p>

        <div className="mt-6 rounded-lg bg-slate-50 border border-slate-100 p-8 text-center">
          <p className="text-sm text-slate-500 italic">Tunnel discovery coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
