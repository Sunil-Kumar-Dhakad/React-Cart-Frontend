import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, selectCartCount,
  removeFromCart, updateQty, clearCart,
} from '../store/cartSlice';

export default function CartSidebar({ open, onClose, onCheckout }) {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const count    = useSelector(selectCartCount);

  const tax      = total * 0.18;
  const grandTotal = total + tax;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose} />

      {/* Sidebar */}
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-header">
          <div>
            <div className="subheading" style={{ fontSize: 18 }}>Your Cart</div>
            <div className="body-sm">{count} item{count !== 1 ? 's' : ''}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 24, color: 'var(--warm2)', cursor: 'pointer', lineHeight: 1, padding: 4 }}
          >×</button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🛒</div>
              <div style={{ color: 'var(--warm)', fontSize: 15, marginBottom: 20 }}>Your cart is empty</div>
              <button className="btn btn-amber btn-sm" onClick={onClose}>Browse Products</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-icon">{item.img}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price.toLocaleString()} each</div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}>+</button>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{ marginLeft: 8, background: 'none', border: 'none', color: 'var(--warm2)', cursor: 'pointer', fontSize: 16, padding: 2 }}
                      title="Remove"
                    >🗑</button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--serif)', color: 'var(--charcoal)', whiteSpace: 'nowrap' }}>
                  ${(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer totals */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
            <div className="cart-total-row"><span>Tax (18%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="cart-total-row"><span>Shipping</span><span style={{ color: 'var(--green)' }}>Free</span></div>
            <div className="cart-total-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
            <button
              className="btn btn-amber btn-full mt-md"
              style={{ padding: 13, fontSize: 15 }}
              onClick={onCheckout}
            >
              Checkout →
            </button>
            <button
              className="btn btn-outline btn-full mt-sm"
              style={{ padding: 10, fontSize: 13 }}
              onClick={() => dispatch(clearCart())}
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
