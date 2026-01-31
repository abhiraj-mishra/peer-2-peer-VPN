import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);

  const [config, setConfig] = useState({
    public_ip: '',
    listen_port: '51820',
    public_key: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/provider/update', config);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 text-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Provider Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Configure your WireGuard node to accept client connections.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-slate-900">
          Server configuration
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
          {/* Public IP */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Public IP address
            </label>
            <input
              type="text"
              name="public_ip"
              value={config.public_ip}
              onChange={handleChange}
              placeholder="203.0.113.42"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          {/* Port */}
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

          {/* Public Key */}
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
