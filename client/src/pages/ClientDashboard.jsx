import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);

  const [config, setConfig] = useState({
    full_name: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/client/update', config);
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
          Client Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile and access available VPN tunnels.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Profile Information
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
              Display name
            </label>
            <input
              type="text"
              name="full_name"
              value={config.full_name}
              onChange={handleChange}
              placeholder="Your name"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
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
