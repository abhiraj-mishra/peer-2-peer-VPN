import { Link } from 'react-router-dom';

const Landing = () => (
  <div style={{ minHeight: '100vh' }}>
    {/* Hero */}
    <div style={{
      maxWidth: 720, margin: '0 auto', padding: '96px 24px 80px',
      textAlign: 'center'
    }}>
      <span className="badge badge-indigo" style={{ marginBottom: 20 }}>
        Beta · WireGuard Peer-to-Peer
      </span>

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
        lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 20
      }}>
        Decentralized VPN<br />
        <span style={{ color: 'var(--accent)' }}>marketplace</span>
      </h1>

      <p style={{
        color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 36px',
        fontSize: '1.05rem', lineHeight: 1.7
      }}>
        Providers list their WireGuard nodes. Clients browse and connect.
        No central servers. Pure peer-to-peer.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '0.925rem' }}>
          Get started
        </Link>
        <Link to="/login" className="btn btn-outline" style={{ padding: '10px 28px', fontSize: '0.925rem' }}>
          Sign in
        </Link>
      </div>
    </div>

    {/* How it works */}
    <div style={{ borderTop: '1px solid var(--border)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>How it works</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { step: '01', title: 'Provider registers', desc: 'Sign up as a provider, enter your WireGuard IP, port, key, and price per GB.' },
            { step: '02', title: 'List on marketplace', desc: 'Toggle your node as listed. Clients can now discover and connect to you.' },
            { step: '03', title: 'Client connects', desc: 'Browse listed providers, pick one, and download your WireGuard config instantly.' },
          ].map(item => (
            <div key={item.step} className="card" style={{ padding: 20 }}>
              <div style={{
                fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)',
                fontFamily: 'monospace', marginBottom: 10
              }}>{item.step}</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
