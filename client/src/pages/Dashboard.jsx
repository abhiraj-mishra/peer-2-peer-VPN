import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProviderDashboard from './ProviderDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="text-center text-white pt-20">Please log in to view the dashboard.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-16">
            {user.role === 'provider' ? <ProviderDashboard /> : <ClientDashboard />}
        </div>
    );
};

export default Dashboard;
