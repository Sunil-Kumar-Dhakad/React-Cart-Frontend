import React from 'react';

const TEAM = [
  { name: 'Rajiv Mehta',   role: 'CEO & Co-Founder',  init: 'RM', hue: 28  },
  { name: 'Priya Sharma',  role: 'CTO',               init: 'PS', hue: 160 },
  { name: 'Arjun Das',     role: 'Head of Design',    init: 'AD', hue: 210 },
  { name: 'Kavita Nair',   role: 'VP Engineering',    init: 'KN', hue: 340 },
  { name: 'Rohan Verma',   role: 'Head of Sales',     init: 'RV', hue: 45  },
  { name: 'Sanya Kapoor',  role: 'Head of Marketing', init: 'SK', hue: 280 },
  { name: 'Dev Patel',     role: 'Lead Architect',    init: 'DP', hue: 120 },
  { name: 'Anita Singh',   role: 'Customer Success',  init: 'AS', hue: 190 },
];

const VALUES = [
  { icon: '🎯', title: 'Mission',       desc: 'Empower every business with tools once reserved for the largest companies in the world. We democratise enterprise software.' },
  { icon: '🌍', title: 'Vision',        desc: 'A world where great software is the great equaliser — helping businesses of all sizes compete, grow, and thrive globally.' },
  { icon: '💛', title: 'Values',        desc: 'Honesty, craftsmanship, and deep respect for the people using our tools. We ship quality, not quantity.' },
];

const MILESTONES = [
  { year: '2019', title: 'Founded',          desc: 'Started in a co-working space in Bengaluru with 4 engineers and one product.' },
  { year: '2020', title: 'First 100 Clients', desc: 'Reached 100 paying customers and raised our seed round of $2M.' },
  { year: '2021', title: 'Series A',          desc: 'Closed $12M Series A, expanded to 3 offices across India.' },
  { year: '2022', title: 'Global Expansion',  desc: 'Launched in Southeast Asia and Middle East, crossing $10M ARR.' },
  { year: '2023', title: '10,000+ Customers', desc: 'Hit 10,000 customers in 38 countries, team grew to 100+ people.' },
  { year: '2024', title: 'Series B',          desc: '$40M raised to accelerate AI product roadmap and US expansion.' },
];

export default function AboutPage({ setPage }) {
  return (
    <div style={{ animation: 'fadeUp .4s ease' }}>

      {/* ── Page Hero ── */}
      <div style={{ background: 'var(--cream2)', borderBottom: '1px solid var(--cream3)', padding: '64px 5% 48px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="label mb-sm">Our Story</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 20 }}>
            We build software that <em>matters</em>
          </h1>
          <p className="body-lg">
            Founded in 2019 in Bengaluru, Nexus started as a small team with a big mission: make
            enterprise-grade software accessible to every business — from ambitious two-person
            startups to Fortune 500 companies.
          </p>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="section container">
        <div className="grid-3 mb-xl">
          {VALUES.map(v => (
            <div key={v.title} className="about-card">
              <div className="about-icon">{v.icon}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{v.title}</div>
              <div style={{ fontSize: 14, color: 'var(--warm)', lineHeight: 1.7 }}>{v.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Dark stats block ── */}
        <div style={{
          background: 'var(--charcoal)', borderRadius: 'var(--r-xl)', padding: '52px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 72,
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>By the numbers</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Five years of building something <span style={{ color: 'var(--amber3)' }}>exceptional</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 15, lineHeight: 1.75 }}>
              From a 4-person team in a co-working space to 120+ engineers across 3 continents —
              our growth reflects the trust our customers place in us every single day.
            </p>
            <button
              className="btn btn-amber mt-lg"
              onClick={() => setPage && setPage('contact')}
            >
              Talk to our team →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['120+', 'Team Members'],
              ['12K+', 'Clients Globally'],
              ['$2B+', 'Transactions Processed'],
              ['42',   'Countries Served'],
            ].map(([n, l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 'var(--r-lg)', padding: 22 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 900, color: 'var(--amber3)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="text-center mb-lg">
          <div className="label mb-sm">Our Journey</div>
          <div className="heading">From idea to industry leader</div>
        </div>
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto 72px' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--cream3)', transform: 'translateX(-50%)' }} />
          {MILESTONES.map((m, i) => (
            <div key={m.year} style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 36, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                <div style={{ background: '#fff', border: '1px solid var(--cream3)', borderRadius: 'var(--r-lg)', padding: '16px 20px', display: 'inline-block', maxWidth: 280 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--warm)', lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
              <div style={{ width: 48, height: 48, background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontWeight: 900, fontSize: 11, color: '#fff', flexShrink: 0, zIndex: 1, border: '3px solid var(--cream)', marginTop: 6 }}>
                {m.year.slice(2)}
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>

        {/* ── Team ── */}
        <div className="text-center mb-lg">
          <div className="label mb-sm">The Team</div>
          <div className="heading">People behind the product</div>
        </div>
        <div className="grid-4">
          {TEAM.map(m => (
            <div key={m.name} className="team-card">
              <div className="team-avatar" style={{ background: `hsl(${m.hue},62%,52%)` }}>{m.init}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 13, color: 'var(--warm)' }}>{m.role}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                {['in', 'tw', 'gh'].map(s => (
                  <div key={s} style={{ width: 28, height: 28, background: 'var(--cream2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--warm)', cursor: 'pointer' }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{ background: 'var(--cream2)', borderTop: '1px solid var(--cream3)', padding: '56px 5%' }}>
        <div className="container text-center" style={{ maxWidth: 600 }}>
          <div className="label mb-sm">Join us</div>
          <div className="heading mb-md">Ready to build with Nexus?</div>
          <p className="body-lg mb-lg" style={{ fontSize: 15 }}>
            Start your free 14-day trial today. No credit card required.
          </p>
          <div className="flex gap-md" style={{ justifyContent: 'center' }}>
            <button className="btn btn-amber btn-lg" onClick={() => setPage && setPage('register')}>Get started free</button>
            <button className="btn btn-outline btn-lg" onClick={() => setPage && setPage('contact')}>Contact sales</button>
          </div>
        </div>
      </div>

    </div>
  );
}
