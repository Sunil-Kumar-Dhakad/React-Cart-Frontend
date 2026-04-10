import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  const colors = { success: '#059669', error: '#DC2626', info: '#D97706' };
  return (
    <div style={{ position:'fixed', top:80, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => onRemove(t.id)} style={{ background:'#fff', borderRadius:10, boxShadow:'0 8px 32px rgba(28,25,23,.14)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:500, borderLeft:`3px solid ${colors[t.type]||colors.info}`, minWidth:260, pointerEvents:'all', cursor:'pointer', animation:'toastIn .3s ease' }}>
          <span style={{ color:colors[t.type]||colors.info, fontWeight:700 }}>{t.type==='success'?'✓':t.type==='error'?'✗':'ℹ'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type='info', duration=3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);

const UIContext = createContext();
export function UIProvider({ children }) {
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <UIContext.Provider value={{ cartOpen, checkoutOpen, openCart:()=>setCartOpen(true), closeCart:()=>setCartOpen(false), openCheckout:()=>{setCartOpen(false);setCheckoutOpen(true);}, closeCheckout:()=>setCheckoutOpen(false) }}>
      {children}
    </UIContext.Provider>
  );
}
export const useUI = () => useContext(UIContext);

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login  = (u, token) => { setUser(u); if(token) localStorage.setItem('nexus_token', token); };
  const logout = () => { setUser(null); localStorage.removeItem('nexus_token'); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

export function AppProvider({ children }) {
  return (
    <ToastProvider>
      <UIProvider>
        <AuthProvider>{children}</AuthProvider>
      </UIProvider>
    </ToastProvider>
  );
}
