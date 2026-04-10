import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { useAuth } from '../context/AppContext';

export default function Navbar({ page, setPage, onCartOpen }) {
  const count = useSelector(selectCartCount);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => setPage('home')}>
        Nexus<span>.</span>
      </div>

      <div className="nav-links">
        {['home', 'products', 'about', 'contact'].map(p => (
          <button
            key={p}
            className={`nav-link${page === p ? ' active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span style={{ fontSize: 13, color: 'var(--warm)', fontWeight: 500 }}>
              Hi, {user.name?.split(' ')[0] || 'User'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => setPage('login')}>
              Sign in
            </button>
            <button className="btn btn-amber btn-sm" onClick={() => setPage('register')}>
              Get started
            </button>
          </>
        )}

        <button className="btn btn-outline cart-btn" onClick={onCartOpen}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </nav>
  );
}
