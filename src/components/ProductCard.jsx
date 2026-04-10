import React from 'react';

export default function ProductCard({ product: p, onAddToCart, onBuyNow, inCart }) {
  const outOfStock = p.stock === 0;

  const badgeStyle = {
    bestseller: { background: 'var(--amber)',   color: '#fff' },
    premium:    { background: 'var(--charcoal)', color: '#fff' },
    new:        { background: '#059669',         color: '#fff' },
    'coming soon': { background: 'var(--warm2)', color: '#fff' },
  };

  return (
    <div className="product-card">
      <div className="product-img">
        {p.badge && badgeStyle[p.badge] && (
          <div className="product-badge" style={badgeStyle[p.badge]}>{p.badge}</div>
        )}
        {outOfStock && (
          <div className="product-badge out">Out of stock</div>
        )}
        <span style={{ fontSize: 64, position: 'relative', zIndex: 1 }}>{p.img}</span>
      </div>

      <div className="product-body">
        <div className="product-cat">{p.category}</div>
        <div className="product-name">{p.name}</div>
        <div className="product-desc">
          {p.description?.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
        </div>

        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(p.rating || 4))}{'☆'.repeat(5 - Math.floor(p.rating || 4))}
          </span>
          <span style={{ fontSize: 12, color: 'var(--warm2)' }}>
            {p.rating} ({p.reviews} reviews)
          </span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            {p.original_price && <small>${p.original_price.toLocaleString()}</small>}
            ${p.price.toLocaleString()}
          </div>

          {outOfStock ? (
            <span style={{ fontSize: 12, color: 'var(--warm2)', fontStyle: 'italic' }}>Notify me</span>
          ) : (
            <div className="product-actions">
              <button
                className={`add-btn${inCart ? ' in-cart' : ''}`}
                onClick={onAddToCart}
                title="Add to cart"
              >
                {inCart ? '✓ Added' : '+ Cart'}
              </button>
              {onBuyNow && (
                <button className="buy-btn" onClick={onBuyNow} title="Buy now">
                  Buy
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
