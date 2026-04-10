import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import { fetchHomeData } from '../services/api';
import { useToast, useUI } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function HomePage({ setPage }) {
  const dispatch     = useDispatch();
  const { addToast } = useToast();
  const { openCheckout } = useUI();
  const cartItems    = useSelector(selectCartItems);

  const [products, setProducts] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  // Promise.all: fetch products + stats simultaneously
  useEffect(() => {
    fetchHomeData()
      .then(({ products, stats }) => { setProducts(products.slice(0, 3)); setStats(stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (p) => { dispatch(addToCart(p)); addToast(`${p.name} added to cart`, 'success'); };
  const handleBuy = (p) => { dispatch(addToCart(p)); openCheckout(); };
  const inCart    = (id) => cartItems.some(i => i.id === id);

  return (
    <div style={{ animation: 'fadeUp .4s ease' }}>
      {/* ── Hero ── */}
      <div className="hero">
        <div>
          <div className="hero-tag">✦ Trusted by 12,000+ businesses</div>
          <h1 className="display">
            Build your <em>future</em> with enterprise software
          </h1>
          <p className="body-lg mt-md">
            Streamline operations, boost productivity, and scale with confidence.
            The complete platform for modern businesses.
          </p>
          <div className="flex gap-md mt-lg">
            <button className="btn btn-amber btn-lg" onClick={() => setPage('products')}>
              Explore Products
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setPage('about')}>
              Learn more
            </button>
          </div>
          <div className="flex gap-lg mt-xl" style={{ borderTop: '1px solid var(--cream3)', paddingTop: 24 }}>
            {[['4.9★', 'Rating'], ['48K+', 'Installs'], ['99.9%', 'Uptime']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--warm2)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="hero-visual">
          <div className="floating-card" style={{ top: 24, right: -10, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: 'var(--warm)', marginBottom: 4 }}>Monthly Revenue</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700 }}>
              ${stats ? stats.monthlyRevenue?.toLocaleString() : '72,840'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 3 }}>↑ 18.4% this month</div>
          </div>

          <div style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(28,25,23,.15))', position: 'relative', zIndex: 1 }}>
            📦
          </div>

          <div className="floating-card" style={{ bottom: 28, left: -10, minWidth: 170 }}>
            <div style={{ fontSize: 11, color: 'var(--warm)', marginBottom: 6 }}>Active Users</div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 6 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: `hsl(${i * 35 + 20},70%,58%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, marginLeft: i ? -6 : 0, border: '2px solid #fff', zIndex: 5 - i }}>U</div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>
              {stats ? stats.totalCustomers?.toLocaleString() : '12,400'}+ online
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        {[
          { n: stats ? stats.totalCustomers?.toLocaleString() + '+' : '12,400+', l: 'Customers' },
          { n: stats ? stats.productsDelivered?.toLocaleString() + '+' : '48,000+', l: 'Products Sold' },
          { n: stats ? stats.uptime : '99.9%', l: 'Uptime SLA' },
          { n: stats ? stats.countries : '42', l: 'Countries' },
        ].map(({ n, l }) => (
          <div key={l} className="stat-item">
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, color: 'var(--amber3)' }}>{n}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── Featured Products ── */}
      <div className="section container">
        <div className="flex flex-between flex-center mb-lg">
          <div>
            <div className="label mb-sm">Featured Products</div>
            <div className="heading">Top picks for your team</div>
          </div>
          <button className="btn btn-outline" onClick={() => setPage('products')}>View all →</button>
        </div>

        {loading ? (
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="product-card">
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: 18 }}>
                  <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '50%' }} />
                  <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 40, marginTop: 14 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={inCart(p.id)}
                onAddToCart={() => handleAdd(p)}
                onBuyNow={() => handleBuy(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Features ── */}
      <div style={{ background: 'var(--cream2)', padding: '60px 5%', borderTop: '1px solid var(--cream3)', borderBottom: '1px solid var(--cream3)' }}>
        <div className="container">
          <div className="text-center mb-lg">
            <div className="label mb-sm">Why Nexus</div>
            <div className="heading">Everything your business needs</div>
          </div>
          <div className="grid-4">
            {[
              { icon: '⚡', title: 'Blazing Fast',       desc: 'Sub-100ms response times with global CDN distribution across 42 countries.' },
              { icon: '🔒', title: 'Bank-Grade Security', desc: 'AES-256 encryption, SOC2 Type II compliance, and 24/7 threat monitoring.' },
              { icon: '📈', title: 'Scales Infinitely',   desc: 'From startup to enterprise — grow without limits or infrastructure changes.' },
              { icon: '🛠',  title: '24/7 Support',       desc: 'Dedicated engineers and a comprehensive knowledge base available round the clock.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--warm)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="section container text-center">
        <div className="label mb-sm">Ready to start?</div>
        <h2 className="heading" style={{ marginBottom: 12 }}>Join 12,000+ businesses building with Nexus</h2>
        <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto 28px', fontSize: 15 }}>
          Start your free 14-day trial. No credit card required.
        </p>
        <div className="flex gap-md" style={{ justifyContent: 'center' }}>
          <button className="btn btn-amber btn-lg" onClick={() => setPage('register')}>Start free trial</button>
          <button className="btn btn-outline btn-lg" onClick={() => setPage('contact')}>Talk to sales</button>
        </div>
      </div>
    </div>
  );
}
