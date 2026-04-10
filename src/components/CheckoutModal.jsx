import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotal } from '../store/cartSlice';
import { orderService, paymentService } from '../services/api';
import { useToast } from '../context/AppContext';

const GATEWAYS = [
  { id: 'stripe',   label: 'Stripe',   icon: '💳', desc: 'Card / Apple Pay' },
  { id: 'razorpay', label: 'Razorpay', icon: '🔷', desc: 'UPI · Netbanking' },
  { id: 'paypal',   label: 'PayPal',   icon: '🅿️', desc: 'PayPal Balance'  },
];

export default function CheckoutModal({ open, onClose }) {
  const dispatch     = useDispatch();
  const { addToast } = useToast();
  const cart  = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const tax      = total * 0.18;
  const grand    = +(total + tax).toFixed(2);

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [gateway, setGateway] = useState('stripe');
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    name:'', email:'', phone:'', address:'', city:'', pincode:'',
    card:'', exp:'', cvv:'',
  });

  if (!open) return null;

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(err => ({ ...err, [k]: '' })); };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.card.replace(/\s/g,'') || form.card.replace(/\s/g,'').length < 16) e.card = 'Enter a valid 16-digit card number';
    if (!form.exp.trim())  e.exp  = 'Required';
    if (!form.cvv.trim() || form.cvv.length < 3) e.cvv = 'Enter 3-digit CVV';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handlePay = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await orderService.create({
        customer_name:  form.name,
        customer_email: form.email,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
      });
      const order = orderRes.data.order;

      // 2. Process payment through chosen gateway
      if (gateway === 'stripe') {
        await paymentService.createStripeIntent({ order_id: order.id });
        await paymentService.confirmStripe({ order_id: order.id });
      } else if (gateway === 'razorpay') {
        const rz = await paymentService.createRazorpay({ order_id: order.id });
        await paymentService.verifyRazorpay({ razorpay_order_id: rz.data.razorpay_order_id, razorpay_payment_id: 'pay_mock_' + Date.now(), razorpay_signature: 'mock', order_id: order.id });
      } else {
        const pp = await paymentService.createPaypal({ order_id: order.id });
        await paymentService.capturePaypal({ paypal_order_id: pp.data.id, order_id: order.id });
      }

      setOrderId(order.order_number);
      dispatch(clearCart());
      setStep(3);
      addToast('Payment successful! 🎉', 'success');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(1); setErrors({}); setForm({ name:'',email:'',phone:'',address:'',city:'',pincode:'',card:'',exp:'',cvv:'' }); }, 300);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="subheading" style={{ fontSize: 18 }}>
              {step === 3 ? '✓ Order Confirmed' : step === 2 ? 'Payment Details' : 'Order Summary'}
            </div>
            {step < 3 && <div className="body-sm" style={{ marginTop: 4 }}>Step {step} of 2 · Secure checkout</div>}
          </div>
          {step < 3 && (
            <button onClick={handleClose} style={{ background:'none', border:'none', fontSize:24, color:'var(--warm2)', cursor:'pointer', lineHeight:1 }}>×</button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* ── Success ── */}
          {step === 3 && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div className="success-circle">✓</div>
              <div className="heading" style={{ marginBottom:10, fontSize:22 }}>Payment Successful!</div>
              <p style={{ color:'var(--warm)', marginBottom:24 }}>
                Your order <strong style={{ color:'var(--charcoal)' }}>{orderId}</strong> has been placed.
              </p>
              <div style={{ background:'var(--cream)', border:'1px solid var(--cream3)', borderRadius:'var(--r)', padding:16, textAlign:'left', marginBottom:24 }}>
                {[['Order ID', orderId], ['Amount Paid', '$' + grand], ['Gateway', gateway], ['Status', '🟡 Processing']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                    <span style={{ color:'var(--warm)' }}>{k}</span>
                    <span style={{ fontWeight:600, textTransform:'capitalize' }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-amber btn-full" style={{ padding:13 }} onClick={handleClose}>Continue Shopping</button>
            </div>
          )}

          {/* ── Step 1: Cart + Shipping ── */}
          {step === 1 && (
            <>
              <div style={{ marginBottom:20 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--cream3)', fontSize:14 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ fontSize:22 }}>{item.img}</span>
                      <div>
                        <div style={{ fontWeight:600 }}>{item.name}</div>
                        <div style={{ fontSize:12, color:'var(--warm)' }}>${item.price.toLocaleString()} × {item.qty}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight:700 }}>${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ marginTop:14, display:'grid', gap:6 }}>
                  {[['Subtotal', '$' + total.toLocaleString()], ['Tax (18%)', '$' + tax.toFixed(2)], ['Shipping', 'Free']].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--warm)' }}><span>{k}</span><span>{v}</span></div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:18, fontFamily:'var(--serif)', paddingTop:10, borderTop:'1px solid var(--cream3)', marginTop:4 }}>
                    <span>Total</span><span>${grand}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>Shipping Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={set('name')} placeholder="John Doe"/>
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="john@email.com"/>
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" value={form.pincode} onChange={set('pincode')} placeholder="452001"/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" value={form.address} onChange={set('address')} placeholder="123, MG Road"/>
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={form.city} onChange={set('city')} placeholder="Indore"/>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <>
              <div style={{ marginBottom:20 }}>
                <div className="form-label" style={{ marginBottom:12 }}>Choose Payment Gateway</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {GATEWAYS.map(gw => (
                    <div
                      key={gw.id}
                      onClick={() => setGateway(gw.id)}
                      style={{ border:`2px solid ${gateway===gw.id?'var(--amber)':'var(--cream3)'}`, borderRadius:'var(--r)', padding:'12px 8px', textAlign:'center', cursor:'pointer', background:gateway===gw.id?'#FFF7ED':'#fff', transition:'all .15s' }}
                    >
                      <div style={{ fontSize:24, marginBottom:4 }}>{gw.icon}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:gateway===gw.id?'var(--amber)':'var(--charcoal)', marginBottom:2 }}>{gw.label}</div>
                      <div style={{ fontSize:11, color:'var(--warm2)' }}>{gw.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:'var(--r)', padding:'10px 14px', marginBottom:18, fontSize:12, color:'#065F46', display:'flex', gap:8, alignItems:'center' }}>
                <span>🔒</span> Your card details are encrypted with TLS 1.3 + AES-256.
              </div>

              <div className="form-group">
                <label className="form-label">Card Number *</label>
                <input
                  className="form-input"
                  value={form.card}
                  onChange={e => setForm(f => ({ ...f, card: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() }))}
                  placeholder="4242 4242 4242 4242"
                  maxLength="19"
                />
                {errors.card && <div className="form-error">{errors.card}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry *</label>
                  <input className="form-input" value={form.exp} onChange={set('exp')} placeholder="MM / YY" maxLength="7"/>
                  {errors.exp && <div className="form-error">{errors.exp}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV *</label>
                  <input className="form-input" value={form.cvv} onChange={set('cvv')} placeholder="•••" maxLength="3" type="password"/>
                  {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                </div>
              </div>

              <div style={{ background:'var(--cream)', border:'1px solid var(--cream3)', borderRadius:'var(--r)', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
                <div style={{ fontSize:13, color:'var(--warm)' }}>Total via <span style={{ textTransform:'capitalize', fontWeight:600 }}>{gateway}</span></div>
                <div style={{ fontFamily:'var(--serif)', fontSize:24, fontWeight:700 }}>${grand}</div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div className="modal-footer">
            {step === 2 && (
              <button className="btn btn-outline" onClick={() => { setStep(1); setErrors({}); }}>← Back</button>
            )}
            <button
              className="btn btn-amber"
              style={{ padding:'11px 28px', minWidth:170 }}
              onClick={step === 1 ? () => { if (validateStep1()) setStep(2); } : handlePay}
              disabled={loading}
            >
              {loading
                ? <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ width:15,height:15,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/> Processing…</span>
                : step === 1 ? 'Continue to Payment →' : `Pay $${grand}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
