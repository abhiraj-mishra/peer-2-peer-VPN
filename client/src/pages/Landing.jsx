import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <div className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-5"></div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 mb-6 border border-slate-200">
            Now in Beta
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
            Decentralized VPN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">for the modern web</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Marketplace built on WireGuard. Securely connect or earn by sharing your bandwidth.
            No central servers, just pure peer-to-peer privacy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="bg-white py-24 sm:py-32 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster & Safer</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to stay secure
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">

              <div className="flex flex-col rounded-2xl bg-slate-50 p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  Decentralized
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">No central authority. Providers run independent nodes, giving you more choice and reliance.</p>
                </dd>
              </div>

              <div className="flex flex-col rounded-2xl bg-slate-50 p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  WireGuard-based
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Built on modern cryptography for high performance, low latency, and instant connections.</p>
                </dd>
              </div>

              <div className="flex flex-col rounded-2xl bg-slate-50 p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  Trust-driven
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Select providers based on region, speed, uptime, and community reputation.</p>
                </dd>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
