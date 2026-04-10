import React from 'react';

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Nexus<span style={{ color: 'var(--amber3)' }}>.</span></div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxWidth: 260, marginTop: 8 }}>
            Enterprise software for the modern business. Trusted by 12,000+ companies worldwide.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.7)', marginBottom: 14 }}>Product</div>
          {['Products', 'Pricing', 'Docs', 'Changelog'].map(l => (
            <div key={l} className="footer-link" onClick={() => l === 'Products' && setPage('products')}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.7)', marginBottom: 14 }}>Company</div>
          {['About', 'Contact', 'Blog', 'Careers'].map(l => (
            <div key={l} className="footer-link" onClick={() => ['About', 'Contact'].includes(l) && setPage(l.toLowerCase())}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.7)', marginBottom: 14 }}>Legal</div>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map(l => (
            <div key={l} className="footer-link">{l}</div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Nexus Technologies Pvt. Ltd. All rights reserved.</span>
        <span>Made with ♥ in Indore, India</span>
      </div>
    </footer>
  );
}
