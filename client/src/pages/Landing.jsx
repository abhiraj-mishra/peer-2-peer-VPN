import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🔒',
    title: 'End-to-End Encrypted',
    desc: 'WireGuard protocol ensures military-grade encryption for every connection.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Peer-to-peer routing with no central bottleneck means maximum speed.',
  },
  {
    icon: '🌍',
    title: 'Global Nodes',
    desc: 'Connect to providers across the world and bypass any restriction.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Provider registers',
    desc: 'Sign up as a provider, enter your WireGuard IP, port, key, and price per GB.',
  },
  {
    step: '02',
    title: 'List on marketplace',
    desc: 'Toggle your node as listed. Clients can now discover and connect to you.',
  },
  {
    step: '03',
    title: 'Client connects',
    desc: 'Browse listed providers, pick one, and download your WireGuard config instantly.',
  },
];

const Landing = () => (
  <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

    {/* ── Hero ─────────────────────────────── */}
    <section style={{
      maxWidth: 760, margin: '0 auto', padding: '90px 24px 80px',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Glow bg */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 320,
        background: 'radial-gradient(ellipse at center, rgba(124,109,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <span className="badge badge-indigo" style={{ marginBottom: 22 }}>
        🔐 Beta · WireGuard Peer-to-Peer
      </span>

      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.04em',
        marginBottom: 22,
      }}>
        Decentralized VPN{' '}
        <span style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>marketplace</span>
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        maxWidth: 500, margin: '0 auto 40px',
        fontSize: '1.05rem', lineHeight: 1.75,
      }}>
        Providers list their WireGuard nodes. Clients browse and connect.
        No central servers. Pure peer-to-peer.
      </p>

      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '0.95rem', borderRadius: 10 }}>
          Get started →
        </Link>
        <Link to="/login" className="btn btn-outline" style={{ padding: '12px 32px', fontSize: '0.95rem', borderRadius: 10 }}>
          Sign in
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 0, justifyContent: 'center',
        marginTop: 60, flexWrap: 'wrap',
        borderTop: '1px solid var(--border)',
        paddingTop: 40,
      }}>
        {[
          { value: 'P2P', label: 'No central server' },
          { value: 'WG', label: 'WireGuard protocol' },
          { value: '0%', label: 'Data retention' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1 1 120px', padding: '0 24px',
            borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Features ─────────────────────────── */}
    <section style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '64px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 40 }}>
          Why P2PVPN
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 20px',
              transition: 'border-color 0.18s, transform 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── How it works ─────────────────────── */}
    <section style={{ padding: '72px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          How it works
        </p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 48, letterSpacing: '-0.03em' }}>
          Three steps to privacy
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {steps.map((item) => (
            <div key={item.step} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -10, right: -8,
                fontSize: '4rem', fontWeight: 900, color: 'rgba(124,109,255,0.06)',
                fontFamily: 'monospace', lineHeight: 1, userSelect: 'none',
              }}>{item.step}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
                fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent)',
                fontFamily: 'monospace', marginBottom: 14,
              }}>{item.step}</div>
              <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────── */}
    <section style={{
      borderTop: '1px solid var(--border)',
      padding: '72px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: 520, margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(124,109,255,0.08) 0%, rgba(167,139,250,0.05) 100%)',
        border: '1px solid rgba(124,109,255,0.2)',
        borderRadius: 24, padding: '48px 32px',
      }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.03em' }}>
          Ready to connect?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.7 }}>
          Join the network and take back control of your internet privacy.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 10 }}>
            Start for free →
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 10 }}>
            I have an account
          </Link>
        </div>
      </div>
    </section>

    {/* ── Footer ───────────────────────────── */}
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px', textAlign: 'center',
      color: 'var(--text-muted)', fontSize: '0.78rem',
    }}>
      <p>P2PVPN · Decentralized WireGuard Marketplace · Beta</p>
    </footer>

    <style>{`
      @media (max-width: 480px) {
        .landing-stats > div { border-right: none !important; border-bottom: 1px solid var(--border); }
      }
    `}</style>
  </div>
);

export default Landing;
