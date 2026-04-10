import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../store/authSlice';
import { useAuth, useToast } from '../context/AppContext';

export default function LoginPage({ setPage }) {
  const dispatch     = useDispatch();
  const reduxLoading = useSelector(selectAuthLoading);
  const reduxError   = useSelector(selectAuthError);
  const { login }    = useAuth();
  const { addToast } = useToast();

  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show,   setShow]   = useState(false);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(err => ({ ...err, [k]: '' }));
    dispatch(clearError());
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      // Dispatch Redux thunk
      const result = await dispatch(loginUser({ email: form.email, password: form.password }));
      if (loginUser.fulfilled.match(result)) {
        // Also update Context auth for Navbar
        login(result.payload, localStorage.getItem('nexus_token'));
        addToast(`Welcome back, ${result.payload.name || result.payload.email}!`, 'success');
        setPage('home');
      }
    } catch {
      addToast('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
            Nexus<span style={{ color: 'var(--amber)' }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--warm)' }}>Sign in to your account</div>
        </div>

        {/* Redux error */}
        {reduxError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--red)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>⚠</span> {reduxError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@company.com"
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Password *</label>
              <span style={{ fontSize: 12, color: 'var(--amber)', cursor: 'pointer', fontWeight: 500 }}>
                Forgot password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--warm2)', cursor: 'pointer', fontSize: 16, padding: 0 }}
              >
                {show ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: 'var(--amber)', cursor: 'pointer' }} />
            <label htmlFor="remember" style={{ fontSize: 13, color: 'var(--warm)', cursor: 'pointer' }}>
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-amber btn-full"
            style={{ padding: 13, fontSize: 15 }}
            disabled={reduxLoading}
          >
            {reduxLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                Signing in…
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--cream3)' }} />
          <span style={{ fontSize: 12, color: 'var(--warm2)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--cream3)' }} />
        </div>

        {/* Social login buttons (visual only) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[{ label: 'Google', icon: 'G' }, { label: 'GitHub', icon: '⌥' }].map(s => (
            <button
              key={s.label}
              type="button"
              className="btn btn-outline"
              style={{ padding: '10px', fontSize: 13, gap: 8 }}
              onClick={() => addToast('OAuth coming soon', 'info')}
            >
              <span style={{ fontWeight: 700 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Sign up link */}
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--warm)' }}>
          Don't have an account?{' '}
          <span
            style={{ color: 'var(--amber)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setPage('register')}
          >
            Sign up free
          </span>
        </div>

        {/* Demo hint */}
        <div style={{ textAlign: 'center', marginTop: 14, padding: '10px 14px', background: 'var(--cream)', borderRadius: 'var(--r)', border: '1px solid var(--cream3)' }}>
          <div style={{ fontSize: 11, color: 'var(--warm2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 4 }}>Demo Mode</div>
          <div style={{ fontSize: 12, color: 'var(--warm)' }}>Any email + password works to log in</div>
        </div>
      </div>
    </div>
  );
}
