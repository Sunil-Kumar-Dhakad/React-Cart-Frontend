import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyEmail, selectAuthLoading, selectAuthError, selectEmailPending, clearError } from '../store/authSlice';
import { useAuth, useToast } from '../context/AppContext';

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#EF4444', '#F59E0B', '#10B981', '#059669'];

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;
  return score;
}

export default function RegisterPage({ setPage }) {
  const dispatch     = useDispatch();
  const loading      = useSelector(selectAuthLoading);
  const authError    = useSelector(selectAuthError);
  const emailPending = useSelector(selectEmailPending);
  const { login }    = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp,  setOtp]  = useState('');
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const strength = passwordStrength(form.password);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(err => ({ ...err, [k]: '' }));
    dispatch(clearError());
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)       e.password = 'Password is required';
    else if (form.password.length < 8)         e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm)        e.confirm  = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password, password_confirmation: form.confirm }));
    if (registerUser.fulfilled.match(result)) {
      addToast('Check your email for the verification code!', 'info');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setErrors({ otp: 'Enter the 6-digit code from your email' }); return; }
    const result = await dispatch(verifyEmail({ email: form.email, otp }));
    if (verifyEmail.fulfilled.match(result)) {
      login(result.payload, localStorage.getItem('nexus_token'));
      addToast('Email verified! Welcome to Nexus 🎉', 'success');
      setPage('home');
    }
  };

  // ── OTP Verification Step ──────────────────────────────────────────────────
  if (emailPending) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📧</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Check your inbox
            </div>
            <div style={{ fontSize: 14, color: 'var(--warm)', lineHeight: 1.6 }}>
              We sent a 6-digit verification code to<br />
              <strong style={{ color: 'var(--charcoal)' }}>{form.email}</strong>
            </div>
          </div>

          {authError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--red)' }}>
              ⚠ {authError}
            </div>
          )}

          <form onSubmit={handleVerify} noValidate>
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <input
                className="form-input"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}); }}
                placeholder="1 2 3 4 5 6"
                maxLength="6"
                style={{ textAlign: 'center', fontSize: 28, letterSpacing: 10, fontFamily: 'var(--serif)', fontWeight: 700 }}
                autoFocus
              />
              {errors.otp && <div className="form-error">{errors.otp}</div>}
            </div>

            {/* OTP progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < otp.length ? 'var(--amber)' : 'var(--cream3)', transition: 'background .15s' }} />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-amber btn-full"
              style={{ padding: 13, fontSize: 15 }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying…' : 'Verify Email →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--warm)' }}>
            Didn't receive it?{' '}
            <span
              style={{ color: 'var(--amber)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => addToast('Verification code resent!', 'info')}
            >
              Resend code
            </span>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16, padding: '8px 14px', background: 'var(--cream)', borderRadius: 'var(--r)', border: '1px solid var(--cream3)', fontSize: 12, color: 'var(--warm)' }}>
            <strong>Demo:</strong> Enter any 6-digit number
          </div>
        </div>
      </div>
    );
  }

  // ── Registration Form ──────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
            Nexus<span style={{ color: 'var(--amber)' }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--warm)' }}>Create your free account</div>
        </div>

        {/* Benefits */}
        <div style={{ background: 'var(--cream)', border: '1px solid var(--cream3)', borderRadius: 'var(--r)', padding: '12px 16px', marginBottom: 24 }}>
          {['14-day free trial, no credit card', 'Full access to all features', 'Cancel anytime'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--charcoal3)', marginBottom: 4 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14 }}>✓</span> {b}
            </div>
          ))}
        </div>

        {authError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--red)' }}>
            ⚠ {authError}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="John Doe" autoComplete="name" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Work Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" autoComplete="email" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--warm2)', cursor: 'pointer', fontSize: 16 }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {/* Strength bar */}
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--cream3)', transition: 'background .2s' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: STRENGTH_COLORS[strength], fontWeight: 600 }}>
                  {STRENGTH_LABELS[strength]} password
                </div>
              </div>
            )}
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              className="form-input"
              type="password"
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {form.confirm && form.confirm === form.password && (
              <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>✓ Passwords match</div>
            )}
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          {/* ToS */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="tos" required style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--amber)', cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="tos" style={{ fontSize: 13, color: 'var(--warm)', lineHeight: 1.5, cursor: 'pointer' }}>
              I agree to the{' '}
              <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-amber btn-full"
            style={{ padding: 13, fontSize: 15 }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                Creating account…
              </span>
            ) : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--warm)' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--amber)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setPage('login')}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}
