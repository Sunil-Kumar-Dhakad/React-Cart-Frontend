import React, { useState } from 'react';
import { contactService } from '../services/api';
import { useToast } from '../context/AppContext';

const SUBJECTS = ['Sales Inquiry', 'Technical Support', 'Partnership', 'Billing', 'Feature Request', 'Other'];

const INFO = [
  { icon: '📍', title: 'Office',          lines: ['42 Tech Park, Vijay Nagar', 'Indore, MP 452010, India'] },
  { icon: '📧', title: 'Email',           lines: ['hello@nexus.io', 'support@nexus.io'] },
  { icon: '📞', title: 'Phone',           lines: ['+91 731 400 1234', '+91 800 NEXUS 01'] },
  { icon: '🕐', title: 'Business Hours',  lines: ['Mon–Fri: 9 am – 7 pm IST', 'Sat: 10 am – 4 pm IST'] },
];

export default function ContactPage() {
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(err => ({ ...err, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await contactService.send(form);
      setSent(true);
      addToast('Message sent! We\'ll reply within 24 hours.', 'success');
    } catch {
      addToast('Failed to send. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeUp .4s ease' }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <div className="label mb-sm">Get in Touch</div>
          <div className="heading">We'd love to hear from you</div>
          <p className="body-lg mt-sm" style={{ maxWidth: 520, fontSize: 15 }}>
            Our team is always happy to chat — whether it's a sales question, a technical issue,
            or just a friendly hello.
          </p>
        </div>
      </div>

      <div className="section container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

          {/* ── Contact Form ── */}
          <div className="contact-form">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>📨</div>
                <div className="subheading mb-sm">Message Sent!</div>
                <p className="body-lg mb-lg" style={{ fontSize: 15 }}>
                  Thanks for reaching out, <strong>{form.name}</strong>!<br />
                  We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  className="btn btn-amber"
                  onClick={() => { setSent(false); setForm({ name:'', email:'', company:'', subject:'', message:'' }); }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                  Send us a message
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={form.name} onChange={set('name')} placeholder="John Doe" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" value={form.company} onChange={set('company')} placeholder="Acme Corp" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject} onChange={set('subject')}>
                      <option value="">Select a topic…</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    rows="6"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us how we can help you…"
                  />
                  {errors.message && <div className="form-error">{errors.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-amber btn-full"
                  style={{ padding: 14, fontSize: 15 }}
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>

          {/* ── Right Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Contact Info Card */}
            <div className="contact-info-card">
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
                Contact Information
              </div>
              {INFO.map(item => (
                <div key={item.title} className="contact-info-item">
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                    {item.lines.map(l => (
                      <div key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Response time card */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>⚡ Average response time</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ ch: 'Live Chat', t: '~2 min' }, { ch: 'Email', t: '~4 hrs' }, { ch: 'Phone', t: 'Immediate' }].map(r => (
                  <div key={r.ch} style={{ flex: 1, textAlign: 'center', background: 'var(--cream)', borderRadius: 'var(--r)', padding: '12px 8px', border: '1px solid var(--cream3)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: 14 }}>{r.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--warm)', marginTop: 4 }}>{r.ch}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ teaser */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📚 Before you write…</div>
              {[
                'How do I reset my password?',
                'Can I upgrade my plan anytime?',
                'Do you offer refunds?',
                'Is my data stored in India?',
              ].map(q => (
                <div key={q} style={{ fontSize: 13, color: 'var(--warm)', padding: '8px 0', borderBottom: '1px solid var(--cream3)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{q}</span>
                  <span style={{ color: 'var(--amber)', fontSize: 16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
