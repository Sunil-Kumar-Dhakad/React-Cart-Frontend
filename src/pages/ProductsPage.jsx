import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import { fetchProductsPage } from '../services/api';
import { useToast } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Software', 'Cloud', 'Analytics', 'Security', 'Infrastructure', 'AI & ML', 'DevOps'];
const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'           },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated'         },
];

export default function ProductsPage({ setPage, onBuyNow }) {
  const dispatch     = useDispatch();
  const { addToast } = useToast();
  const cartItems    = useSelector(selectCartItems);

  const [products,  setProducts]  = useState([]);
  const [meta,      setMeta]      = useState({ total: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('All');
  const [sort,      setSort]      = useState('default');
  const [debSearch, setDebSearch] = useState('');

  // Debounce search input by 400 ms
  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch via Promise.all whenever filters change
  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {
      search:   debSearch || undefined,
      category: category !== 'All' ? category : undefined,
      sort,
      per_page: 12,
    };
    fetchProductsPage(params)
      .then(({ products: data, meta: m }) => { setProducts(data); setMeta(m || { total: data.length }); })
      .catch(() => setError('Failed to load products. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [debSearch, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sort client-side after fetch
  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating')     return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const inCart       = (id) => cartItems.some(i => i.id === id);
  const handleAdd    = (p)  => { dispatch(addToCart(p)); addToast(`${p.name} added to cart`, 'success'); };
  const handleBuyNow = (p)  => { dispatch(addToCart(p)); addToast(`Opening checkout…`, 'info'); onBuyNow?.(); };
  const clearFilters = ()   => { setSearch(''); setCategory('All'); setSort('default'); };

  return (
    <div style={{ animation: 'fadeUp .4s ease' }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div className="label mb-sm">Product Catalog</div>
          <h1 className="heading">All Products</h1>
          <p className="body-lg mt-sm" style={{ maxWidth: 560, fontSize: 15 }}>
            {loading ? 'Loading…' : `${meta.total} products available.`}{' '}
            All plans include a 30-day money-back guarantee.
          </p>
        </div>
      </div>

      <div className="section-sm container">

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          {/* Search box */}
          <div className="search-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--warm2)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Category chips */}
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-chip${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '7px 32px 7px 12px', fontSize: 13, marginLeft: 'auto',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2378716C' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', appearance: 'none' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
          </select>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p style={{ fontSize: 13, color: 'var(--warm)', marginBottom: 24 }}>
            Showing <strong>{sorted.length}</strong> of <strong>{meta.total}</strong> products
            {category !== 'All' && <> in <strong>{category}</strong></>}
            {debSearch && <> for "<strong>{debSearch}</strong>"</>}
            {(category !== 'All' || debSearch || sort !== 'default') && (
              <button onClick={clearFilters} style={{ marginLeft: 10, background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}>
                Clear filters ×
              </button>
            )}
          </p>
        )}

        {/* ── States ── */}
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card">
                <div className="skeleton" style={{ height: 200 }} />
                <div style={{ padding: 18 }}>
                  <div className="skeleton" style={{ height: 11, width: '45%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 20, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 20 }} />
                  <div className="skeleton" style={{ height: 38 }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontSize: 16, color: 'var(--warm)', marginBottom: 20 }}>{error}</div>
            <button className="btn btn-amber" onClick={fetchProducts}>Retry</button>
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
            <div style={{ fontSize: 16, color: 'var(--warm)', marginBottom: 8 }}>No products found</div>
            <div style={{ fontSize: 14, color: 'var(--warm2)', marginBottom: 24 }}>
              {debSearch ? `No results for "${debSearch}"` : `No products in ${category}`}
            </div>
            <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {sorted.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                inCart={inCart(product.id)}
                onAddToCart={() => handleAdd(product)}
                onBuyNow={() => handleBuyNow(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      {!loading && sorted.length > 0 && (
        <div style={{ background: 'var(--cream2)', borderTop: '1px solid var(--cream3)', padding: '48px 5%', textAlign: 'center' }}>
          <div className="label mb-sm">Need something custom?</div>
          <div className="heading" style={{ fontSize: 26, marginBottom: 12 }}>Talk to our sales team</div>
          <p style={{ color: 'var(--warm)', fontSize: 15, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Enterprise pricing, custom integrations, and dedicated support available.
          </p>
          <button className="btn btn-amber btn-lg" onClick={() => setPage && setPage('contact')}>
            Contact Sales →
          </button>
        </div>
      )}
    </div>
  );
}
